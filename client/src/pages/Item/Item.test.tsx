import { faker } from '@faker-js/faker';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import l10n from '~/src/l10n';
import {
  type RenderResult,
  fireEvent,
  render,
  renderRouter,
  testUser,
  waitFor,
} from '~/src/testing';
import { item as itemMock } from '~/src/testing/mocks';
import { item as itemURL, itemsSearch } from '~/src/urls';

import { Component as Item } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
  };
});
jest.mock('@mui/material/useMediaQuery');
jest.mock('~/src/api/items/get');

const id = faker.number.int();

describe('When the user owns the item', () => {
  const item = itemMock({ id, user: testUser });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(item);
    wrapper = renderRouter(
      [
        { Component: Item, path: itemURL() },
        { element: <div data-testid="search-page" />, path: itemsSearch() },
      ],
      [itemURL(id.toString())],
    );
    await waitFor(() =>
      expect(wrapper.queryAllByTestId('item__image')).toHaveLength(
        item.images.length,
      ),
    );
  });

  test('Disables the new thread button', () => {
    expect(
      wrapper.queryByTestId('item__action--thread-create'),
    ).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('When the user does not own the item', () => {
  const item = itemMock({ id });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(item);
    wrapper = renderRouter(
      [
        { Component: Item, path: itemURL() },
        { element: <div data-testid="search-page" />, path: itemsSearch() },
      ],
      [itemURL(id.toString())],
    );
    await waitFor(() =>
      expect(wrapper.queryAllByTestId('item__image')).toHaveLength(
        item.images.length,
      ),
    );
  });

  test('Renders the correct amount of images', () => {
    expect(wrapper.queryAllByTestId('item__image')).toHaveLength(
      item.images.length,
    );
  });

  test('Does not show any image modals', () => {
    expect(wrapper.queryByTestId('item__image--large')).not.toBeInTheDocument();
  });

  describe('After clicking on an image thumbnail', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getAllByTestId('item__image')[0]);
    });

    test('Shows a lightbox dialog', () => {
      expect(wrapper.queryByTestId('lightbox-dialog')).toBeInTheDocument();
    });

    describe('Closing the modal', () => {
      beforeEach(async () => {
        fireEvent.keyDown(wrapper.getByTestId('lightbox-dialog'), {
          charCode: 27,
          code: 'Escape',
          key: 'Escape',
        });
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('lightbox-dialog__image'),
          ).not.toBeVisible(),
        );
      });

      test('Stops showing the lightbox dialog', () => {
        expect(
          wrapper.queryByTestId('lightbox-dialog__image'),
        ).not.toBeVisible();
      });
    });
  });

  describe('Clicking on a tag', () => {
    beforeEach(async () => {
      fireEvent.click(wrapper.getAllByTestId('item__tag')[0]);
      await waitFor(() =>
        expect(wrapper.queryByTestId('search-page')).toBeInTheDocument(),
      );
    });

    test('Redirects to the search page', () => {
      expect(wrapper.queryByTestId('search-page')).toBeInTheDocument();
    });
  });

  describe('When clicking on the location', () => {
    beforeEach(async () => {
      fireEvent.click(wrapper.getByTestId('item__location'));
      await waitFor(() =>
        expect(wrapper.queryByTestId('search-page')).toBeInTheDocument(),
      );
    });

    test('Redirects to the search page', () => {
      expect(wrapper.queryByTestId('search-page')).toBeInTheDocument();
    });
  });

  describe('When clicking an item location map', () => {
    beforeEach(async () => {
      fireEvent.click(wrapper.getByTestId('item__location--map'));
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('location-map-dialog__content'),
        ).toBeInTheDocument(),
      );
    });

    test('Renders the map', () => {
      expect(
        wrapper.queryByTestId('location-map-dialog__content'),
      ).toBeInTheDocument();
    });

    describe('Closing the map again', () => {
      beforeEach(async () => {
        fireEvent.keyDown(wrapper.getByTestId('location-map-dialog'), {
          charCode: 27,
          code: 'Escape',
          key: 'Escape',
        });
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('location-map-dialog__content'),
          ).not.toBeInTheDocument(),
        );
      });

      test('Hides the map again', () => {
        expect(
          wrapper.queryByTestId('location-map-dialog__content'),
        ).not.toBeInTheDocument();
      });
    });
  });
});

describe('When sharing is disabled', () => {
  const item = itemMock({ id, user: testUser });

  let canShare: (shareData: ShareData) => boolean;
  let wrapper: RenderResult;

  afterEach(() => {
    Object.defineProperty<Navigator>(navigator, 'canShare', {
      configurable: true,
      value: canShare,
      writable: false,
    });
  });

  beforeEach(async () => {
    canShare = navigator.canShare;
    Object.defineProperty<Navigator>(navigator, 'canShare', {
      configurable: true,
      value: undefined,
      writable: true,
    });
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(item);
    wrapper = renderRouter(
      [
        { Component: Item, path: itemURL() },
        { element: <div data-testid="search-page" />, path: itemsSearch() },
      ],
      [itemURL(id.toString())],
    );
  });

  test('Disables the share button', () => {
    expect(wrapper.queryByTestId('item__share')).toBeDisabled();
  });
});

describe('When sharing is enabled', () => {
  const item = itemMock({ id, user: testUser });
  const share = jest.fn();

  let canShareOriginal: (shareData: ShareData) => boolean;
  let shareOriginal: (shareDat: ShareData) => Promise<void>;
  let wrapper: RenderResult;

  afterEach(() => {
    Object.defineProperty<Navigator>(navigator, 'canShare', {
      configurable: true,
      value: canShareOriginal,
      writable: true,
    });
    Object.defineProperty<Navigator>(navigator, 'share', {
      configurable: true,
      value: shareOriginal,
      writable: true,
    });
  });

  beforeEach(async () => {
    canShareOriginal = navigator.canShare;
    Object.defineProperty<Navigator>(navigator, 'canShare', {
      configurable: true,
      value: () => true,
      writable: true,
    });
    shareOriginal = navigator.share;
    Object.defineProperty<Navigator>(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(item);
    wrapper = renderRouter(
      [
        { Component: Item, path: itemURL() },
        { element: <div data-testid="search-page" />, path: itemsSearch() },
      ],
      [itemURL(id.toString())],
    );
  });

  describe('When sharing fails', () => {
    describe('With a generic failure', () => {
      beforeEach(async () => {
        share.mockClear().mockRejectedValue(new Error('Failed to share'));
        fireEvent.click(wrapper.getByTestId('item__share'));
        await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
        await waitFor(
          () =>
            expect(wrapper.queryByTestId('notifications__notification'))
              .toBeInTheDocument,
        );
      });

      test('Shows a notification that something went wrong', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).toHaveTextContent(l10n.itemShareError);
      });
    });

    describe('When the user cancels the share operation', () => {
      beforeEach(async () => {
        share
          .mockClear()
          .mockRejectedValue(
            new DOMException(
              'The user cancelled the share operation',
              'AbortError',
            ),
          );
        fireEvent.click(wrapper.getByTestId('item__share'));
        await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
        await waitFor(
          () =>
            expect(wrapper.queryByTestId('notifications__notification')).not
              .toBeInTheDocument,
        );
      });

      test('Does not show any notification', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('When sharing succeeds', () => {
    beforeEach(async () => {
      share.mockClear().mockResolvedValue(undefined);
      fireEvent.click(wrapper.getByTestId('item__share'));
      await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    });

    test('Calls the share method', () => {
      expect(share).toHaveBeenCalledTimes(1);
    });
  });
});

type TestCase = [name: string, large: boolean, medium: boolean];
describe.each<TestCase>([
  ['large', true, true],
  ['medium', false, true],
  ['small', false, false],
])('Renders at the %s size', (name, large, medium) => {
  const item = itemMock();

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(item);
    (useMediaQuery as jest.Mock)
      .mockClear()
      .mockReturnValueOnce(large)
      .mockReturnValueOnce(medium)
      // This line (below) is for the other `useMediaQueries` calls,
      // like the on in `<Giver />`. It also has to alternate.
      .mockReturnValue(large);
    wrapper = render(<Item />, { user: null });
    await waitFor(() =>
      expect(wrapper.queryAllByTestId('item__image')).toHaveLength(
        item.images.length,
      ),
    );
  });

  test('Renders the correct amount of images', () => {
    expect(wrapper.queryAllByTestId('item__image')).toHaveLength(
      item.images.length,
    );
  });
});

import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import itemGet from '~/src/api/items/get';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { item as itemMock } from '~/src/testing/mocks';

import Item from './index';

jest.mock('@mui/material/useMediaQuery');
jest.mock('~/src/api/items/get');

describe('When the API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (itemGet as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch the item'));
    wrapper = render(<Item />);
    await waitFor(() => expect(itemGet).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('item__error__retry')).toBeInTheDocument(),
    );
  });

  test('Shows an error message', () => {
    expect(wrapper.queryByTestId('item__error__retry')).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    const item = itemMock();

    beforeEach(async () => {
      (itemGet as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: item, status: 200 });
      fireEvent.click(wrapper.getByTestId('item__error__retry'));
      await waitFor(() => expect(itemGet).toHaveBeenCalledTimes(1));
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
      expect(
        wrapper.queryByTestId('item__image--large'),
      ).not.toBeInTheDocument();
    });

    describe('After clicking on an image thumbnail', () => {
      beforeEach(() => {
        fireEvent.click(wrapper.getAllByTestId('item__image')[0]);
      });

      test('Shows an image modal', () => {
        expect(wrapper.queryByTestId('item__image--large')).toBeInTheDocument();
      });

      describe('After closing the modal', () => {
        beforeEach(() => {
          fireEvent.keyDown(wrapper.getByTestId('item__image--large'), {
            charCode: 27,
            code: 'Escape',
            key: 'Escape',
            keyCode: 27,
          });
        });

        test('Does not show any image modals', () => {
          expect(wrapper.queryByTestId('item__image--large')).not.toBeVisible();
        });
      });
    });

    describe('Opening the context menu', () => {
      beforeEach(async () => {
        fireEvent.click(wrapper.getByTestId('item__context-menu'));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('item__action--contact-giver'),
          ).toBeInTheDocument(),
        );
      });

      test('Shows the context menu', () => {
        expect(
          wrapper.queryByTestId('item__action--contact-giver'),
        ).toBeInTheDocument();
      });

      describe('Closing the context menu', () => {
        beforeEach(() => {
          fireEvent.click(wrapper.getByRole('presentation').firstChild!);
        });

        test('Hides the context menu', () => {
          expect(
            wrapper.queryByTestId('item__action--contact-giver'),
          ).not.toBeVisible();
        });
      });
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
    (itemGet as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: item, status: 200 });
    (useMediaQuery as jest.Mock)
      .mockClear()
      .mockReturnValueOnce(true) // (prefers-color-scheme: dark)
      .mockReturnValueOnce(large)
      .mockReturnValueOnce(medium);
    wrapper = render(<Item />);
    await waitFor(() => expect(itemGet).toHaveBeenCalledTimes(1));
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

import { faker } from '@faker-js/faker';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import itemGet from '~/src/api/items/get';
import {
  fireEvent,
  render,
  RenderResult,
  testUser,
  waitFor,
} from '~/src/testing';
import { item as itemMock } from '~/src/testing/mocks';
import { item as itemURL, itemsSearch } from '~/src/urls';

import Item from './index';

jest.mock('@mui/material/useMediaQuery');
jest.mock('~/src/api/items/get');

const id = faker.number.int();

describe('When the API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (itemGet as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch the item'));
    wrapper = render(
      <Routes>
        <Route element={<Item />} path={itemURL()} />
        <Route
          element={<div data-testid="search-page" />}
          path={itemsSearch()}
        />
      </Routes>,
      { router: { initialEntries: [itemURL(id.toString())] } },
    );
    await waitFor(() => expect(itemGet).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('item__error__retry')).toBeInTheDocument(),
    );
  });

  test('Shows an error message', () => {
    expect(wrapper.queryByTestId('item__error__retry')).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    describe('When the user owns the item', () => {
      const item = itemMock({ id, user: testUser });

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

      test('Does not render the new thread button', () => {
        expect(
          wrapper.queryByTestId('item__action--thread-create'),
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not own the item', () => {
      const item = itemMock({ id });

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
          expect(
            wrapper.queryByTestId('item__image--large'),
          ).toBeInTheDocument();
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
            expect(
              wrapper.queryByTestId('item__image--large'),
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
    wrapper = render(<Item />, { user: null });
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

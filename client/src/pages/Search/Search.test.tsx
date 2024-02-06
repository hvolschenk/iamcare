import React from 'react';
import { Route, Routes } from 'react-router-dom';

import itemsSearch from '~/src/api/items/search';
import locationByGooglePlaceID from '~/src/api/locations/google';
import tags from '~/src/api/tag/all';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '~/src/testing';
import {
  autocompleteResponse as autocompleteResponseMock,
  item as itemMock,
  locationBasic as locationBasicMock,
  tag as tagMock,
} from '~/src/testing/mocks';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';
import { itemsSearch as itemsSearchURL } from '~/src/urls';

import Search from './index';

jest.mock('~/src/api/items/search');
jest.mock('~/src/api/locations/google');
jest.mock('~/src/api/tag/all');

const tagsList = [tagMock(), tagMock(), tagMock()];
const autocompleteResponse = autocompleteResponseMock();
const { autocomplete } = useGooglePlaces();

beforeEach(() => {
  (autocomplete as jest.Mock)
    .mockClear()
    .mockResolvedValue(autocompleteResponse);
  (tags as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: { data: tagsList }, status: 200 });
});

describe('When the API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (itemsSearch as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch'));
    wrapper = render(
      <Routes>
        <Route element={<Search />} path={itemsSearchURL()} />
      </Routes>,
      { router: { initialEntries: [itemsSearchURL()] } },
    );
    // This runs twice, initially. The filters take a second to update from URL
    await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(wrapper.queryByTestId('search__error__retry')).toBeInTheDocument(),
    );
  });

  test('Renders the error message and retry button', () => {
    expect(wrapper.queryByTestId('search__error__retry')).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    describe('When no results are found', () => {
      const items: Item[] = [];
      const itemsCollection: APICollectionPaginated<Item> = {
        data: items,
        links: {
          first: 'first',
          last: 'last',
          next: 'next',
          prev: 'prev',
        },
        meta: {
          current_page: 0,
          from: 0,
          last_page: 0,
          links: [],
          path: 'path',
          per_page: 3,
          to: 0,
          total: 0,
        },
      };

      beforeEach(async () => {
        (itemsSearch as jest.Mock)
          .mockClear()
          .mockResolvedValue({ data: itemsCollection, status: 200 });
        fireEvent.click(wrapper.getByTestId('search__error__retry'));
        await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('search__filters__tags'),
          ).not.toBeDisabled(),
        );
      });

      test('Shows a message indicating that there are no results', () => {
        expect(
          wrapper.queryByTestId('search__error__no-results'),
        ).toBeInTheDocument();
      });
    });

    describe('When results are found', () => {
      const items = [itemMock(), itemMock(), itemMock()];
      const itemsCollection: APICollectionPaginated<Item> = {
        data: items,
        links: {
          first: 'first',
          last: 'last',
          next: 'next',
          prev: 'prev',
        },
        meta: {
          current_page: 1,
          from: 1,
          last_page: 2,
          links: [],
          path: 'path',
          per_page: 3,
          to: 3,
          total: 5,
        },
      };

      beforeEach(async () => {
        (itemsSearch as jest.Mock)
          .mockClear()
          .mockResolvedValue({ data: itemsCollection, status: 200 });
        fireEvent.click(wrapper.getByTestId('search__error__retry'));
        await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('search__filters__tags'),
          ).not.toBeDisabled(),
        );
      });

      test('Renders the correct amount of search results', () => {
        expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
          items.length,
        );
      });

      describe('Filtering by a specific tag', () => {
        const itemsByTag = [itemMock()];
        const itemsCollectionByTag: APICollectionPaginated<Item> = {
          data: itemsByTag,
          links: {
            first: 'first',
            last: 'last',
            next: 'next',
            prev: 'prev',
          },
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: 'path',
            per_page: 3,
            to: 1,
            total: 1,
          },
        };

        beforeEach(async () => {
          (itemsSearch as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: itemsCollectionByTag, status: 200 });
          fireEvent.click(wrapper.getAllByTestId('search-item__tag')[0]);
          await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
        });

        test('Renders the correct amount of search results', () => {
          expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
            itemsByTag.length,
          );
        });
      });

      describe('Pagination', () => {
        const itemsPaginated = [itemMock(), itemMock()];
        const itemsCollectionPaginated: APICollectionPaginated<Item> = {
          data: itemsPaginated,
          links: {
            first: 'first',
            last: 'last',
            next: 'next',
            prev: 'prev',
          },
          meta: {
            current_page: 2,
            from: 4,
            last_page: 2,
            links: [],
            path: 'path',
            per_page: 3,
            to: 5,
            total: 5,
          },
        };

        beforeEach(async () => {
          (itemsSearch as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: itemsCollectionPaginated, status: 200 });
          fireEvent.click(
            wrapper.getAllByTestId('search-results__pagination__item')[2],
          );
          await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
        });

        test('Renders the correct amount of search results', () => {
          expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
            itemsPaginated.length,
          );
        });
      });

      describe('Filtering', () => {
        const itemsFiltered = [itemMock()];
        const itemsCollectionFiltered: APICollectionPaginated<Item> = {
          data: itemsFiltered,
          links: {
            first: 'first',
            last: 'last',
            next: 'next',
            prev: 'prev',
          },
          meta: {
            current_page: 2,
            from: 4,
            last_page: 2,
            links: [],
            path: 'path',
            per_page: 3,
            to: 5,
            total: 5,
          },
        };

        beforeEach(async () => {
          const locationBasic = locationBasicMock();
          (locationByGooglePlaceID as jest.Mock).mockClear().mockResolvedValue({
            data: locationBasic,
            status: 200,
          });

          (itemsSearch as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: itemsCollectionFiltered, status: 200 });

          fireEvent.click(wrapper.getByTestId('search__filters__summary'));

          fireEvent.mouseDown(
            within(wrapper.getByTestId('tags-select__select')).getByRole(
              'combobox',
            ),
          );
          await waitFor(() =>
            expect(wrapper.getAllByTestId('tags-select__option')).toHaveLength(
              tagsList.length,
            ),
          );
          fireEvent.click(wrapper.getAllByTestId('tags-select__option')[0]);

          fireEvent.change(wrapper.getByTestId('search__filters--location'), {
            target: { value: 'Ras' },
          });

          await waitFor(() => expect(autocomplete).toHaveBeenCalledTimes(1));

          await waitFor(() =>
            expect(
              wrapper.queryAllByTestId('place-autocomplete__suggestion').length,
            ).toBeGreaterThanOrEqual(1),
          );
          fireEvent.click(
            wrapper.getAllByTestId('place-autocomplete__suggestion')[0],
          );
          await waitFor(() =>
            expect(
              wrapper.getByTestId('search__filters--location'),
            ).toHaveValue(
              autocompleteResponse.predictions[0].structured_formatting
                .main_text,
            ),
          );
          fireEvent.blur(wrapper.getByTestId('search__filters--location'));

          fireEvent.click(wrapper.getByTestId('search__filters__filter'));

          await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
        });

        test('Renders the correct amount of search results', () => {
          expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
            itemsFiltered.length,
          );
        });

        describe('When clearing the search', () => {
          beforeEach(async () => {
            (itemsSearch as jest.Mock)
              .mockClear()
              .mockResolvedValue({ data: itemsCollection, status: 200 });
            fireEvent.click(wrapper.getByTestId('search__filters__clear'));
            await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
          });

          test('Renders the correct amount of search results', () => {
            expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
              items.length,
            );
          });
        });
      });
    });
  });
});

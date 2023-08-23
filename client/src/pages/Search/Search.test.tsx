import { faker } from '@faker-js/faker';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import itemsSearch from '~/src/api/items/search';
import locationByGooglePlaceID from '~/src/api/locations/google';
import l10n from '~/src/l10n';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import {
  autocompleteResponse as autocompleteResponseMock,
  item as itemMock,
  locationBasic as locationBasicMock,
} from '~/src/testing/mocks';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';
import { itemsSearch as itemsSearchURL } from '~/src/urls';

import Search from './index';

jest.mock('~/src/api/items/search');
jest.mock('~/src/api/locations/google');

const locationBasic = locationBasicMock();
const searchQuery = faker.word.sample();

describe('With no saved filters', () => {
  describe('When the API call fails', () => {
    let wrapper: RenderResult;

    beforeEach(async () => {
      (itemsSearch as jest.Mock)
        .mockClear()
        .mockRejectedValue(new Error('Faile to search'));
      wrapper = render(
        <Routes>
          <Route element={<Search />} path={itemsSearchURL()} />
        </Routes>,
        {
          router: {
            initialEntries: [itemsSearchURL({})],
          },
        },
      );
      await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('search__error__retry'),
        ).toBeInTheDocument(),
      );
    });

    test('Shows an error message and retry button', () => {
      expect(wrapper.queryByTestId('search__error__retry')).toBeInTheDocument();
    });

    describe('When retrying and the API call succeeds', () => {
      const resultsEmpty: APICollectionPaginated<Item> = {
        data: [],
        links: { first: '', last: '', next: null, prev: null },
        meta: {
          current_page: 1,
          from: 0,
          last_page: 1,
          links: [],
          path: '',
          per_page: 3,
          to: 0,
          total: 0,
        },
      };

      describe('When there are no results', () => {
        beforeEach(async () => {
          (itemsSearch as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: resultsEmpty, status: 200 });
          fireEvent.click(wrapper.getByTestId('search__error__retry'));
          await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
          await waitFor(() =>
            expect(
              wrapper.queryByTestId('search__error__no-results'),
            ).toBeInTheDocument(),
          );
        });

        test('Shows a notification that there are no results', () => {
          expect(
            wrapper.queryByTestId('search__error__no-results'),
          ).toHaveTextContent(
            l10n.formatString(l10n.searchErrorNoResults, {
              searchTerm: '',
            }) as string,
          );
        });
      });

      describe('When there are results', () => {
        const resultsPage1 = {
          ...resultsEmpty,
          data: [itemMock(), itemMock(), itemMock()],
          meta: {
            ...resultsEmpty.meta,
            from: 1,
            last_page: 2,
            to: 3,
            total: 5,
          },
        };

        beforeEach(async () => {
          (itemsSearch as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: resultsPage1, status: 200 });
          fireEvent.click(wrapper.getByTestId('search__error__retry'));
          await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
          await waitFor(() =>
            expect(wrapper.queryAllByTestId('search__item')).toHaveLength(
              resultsPage1.data.length,
            ),
          );
        });

        test('Renders the correct amount of results', () => {
          expect(wrapper.queryAllByTestId('search__item')).toHaveLength(
            resultsPage1.data.length,
          );
        });

        describe('After updating the filters', () => {
          beforeEach(async () => {
            (itemsSearch as jest.Mock).mockClear();
            const { autocomplete } = useGooglePlaces();
            const autocompleteResponse = autocompleteResponseMock();
            (autocomplete as jest.Mock)
              .mockClear()
              .mockResolvedValue(autocompleteResponse);
            fireEvent.change(wrapper.getByTestId('search__filters--location'), {
              target: { value: 'Care' },
            });
            await waitFor(() => expect(autocomplete).toHaveBeenCalledTimes(1));
            await waitFor(() =>
              expect(
                wrapper.queryAllByTestId('place-autocomplete__suggestion')
                  .length,
              ).toBeGreaterThanOrEqual(1),
            );
            fireEvent.click(
              wrapper.getAllByTestId('place-autocomplete__suggestion')[0],
            );
            fireEvent.change(wrapper.getByTestId('search__filters--distance'), {
              target: { value: '10' },
            });
            fireEvent.click(wrapper.getByTestId('search__filters__filter'));
            await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
          });

          test('Searches after applying the filters', () => {
            expect(itemsSearch).toHaveBeenCalledTimes(1);
          });
        });

        describe('Going to the next page', () => {
          const resultsPage2 = {
            ...resultsEmpty,
            data: [itemMock(), itemMock()],
            meta: {
              ...resultsEmpty.meta,
              current_page: 2,
              from: 4,
              last_page: 2,
              to: 5,
              total: 5,
            },
          };

          beforeEach(async () => {
            (itemsSearch as jest.Mock)
              .mockClear()
              .mockResolvedValue({ data: resultsPage2, status: 200 });
            fireEvent.click(
              wrapper.getAllByTestId('search-results__pagination__item')[2],
            );
            await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
            await waitFor(() =>
              expect(wrapper.queryAllByTestId('search__item')).toHaveLength(
                resultsPage2.data.length,
              ),
            );
          });

          test('Renders the correct amount of results', () => {
            expect(wrapper.queryAllByTestId('search__item')).toHaveLength(
              resultsPage2.data.length,
            );
          });
        });
      });
    });
  });
});

describe('With saved filters', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    const resultsEmpty: APICollectionPaginated<Item> = {
      data: [],
      links: { first: '', last: '', next: null, prev: null },
      meta: {
        current_page: 1,
        from: 0,
        last_page: 1,
        links: [],
        path: '',
        per_page: 3,
        to: 0,
        total: 0,
      },
    };
    (itemsSearch as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: resultsEmpty, status: 200 });
    (locationByGooglePlaceID as jest.Mock).mockClear().mockResolvedValue({
      data: locationBasic,
      status: 200,
    });
    wrapper = render(
      <Routes>
        <Route element={<Search />} path={itemsSearchURL()} />
      </Routes>,
      {
        router: {
          initialEntries: [
            itemsSearchURL({
              location: locationBasic.googlePlaceID,
              query: searchQuery,
            }),
          ],
        },
      },
    );
    await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(locationByGooglePlaceID).toHaveBeenCalledTimes(1),
    );
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('search__error__no-results'),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(wrapper.queryByTestId('search__filters--location')).toHaveValue(
        locationBasic.name,
      ),
    );
  });

  test('Sets the correct location filter', () => {
    expect(wrapper.queryByTestId('search__filters--location')).toHaveValue(
      locationBasic.name,
    );
  });
});

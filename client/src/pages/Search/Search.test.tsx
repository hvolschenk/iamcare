import { faker } from '@faker-js/faker';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import locationByGooglePlaceID from '~/src/api/locations/google';
import tags from '~/src/api/tag/all';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import {
  fireEvent,
  renderRouter,
  RenderResult,
  waitFor,
  within,
} from '~/src/testing';
import {
  apiCollectionPaginated,
  autocompleteResponse as autocompleteResponseMock,
  item as itemMock,
  locationBasic as locationBasicMock,
  tag as tagMock,
} from '~/src/testing/mocks';
import { Item } from '~/src/types/Item';
import { item as itemURL, itemsSearch as itemsSearchURL } from '~/src/urls';

import { Component as Search } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
  };
});
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

const query = faker.word.sample();

describe('When no results are found', () => {
  const items: Item[] = [];
  const itemsCollection = apiCollectionPaginated<Item>({
    data: items,
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
  });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(itemsCollection);
    wrapper = renderRouter(
      [
        { Component: Search, path: itemsSearchURL() },
        { element: <div data-testid="item" />, path: itemURL() },
      ],
      [itemsSearchURL({ query })],
    );
    await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('search__filters__tags')).not.toBeDisabled(),
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
  const itemsCollection = apiCollectionPaginated<Item>({
    data: items,
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
  });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(itemsCollection);
    wrapper = renderRouter(
      [
        { Component: Search, path: itemsSearchURL() },
        { element: <div data-testid="item" />, path: itemURL() },
      ],
      [itemsSearchURL({ query })],
    );
    await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('search__filters__tags')).not.toBeDisabled(),
    );
  });

  test('Renders the correct amount of search results', () => {
    expect(wrapper.queryAllByTestId('search-item')).toHaveLength(items.length);
  });

  describe('Filtering by a specific tag', () => {
    const itemsByTag = [itemMock()];
    const itemsCollectionByTag = apiCollectionPaginated<Item>({
      data: itemsByTag,
    });

    beforeEach(async () => {
      (useLoaderData as jest.Mock)
        .mockClear()
        .mockReturnValue(itemsCollectionByTag);
      fireEvent.click(wrapper.getAllByTestId('search-item__tag')[0]);
    });

    test('Renders the correct amount of search results', () => {
      expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
        itemsByTag.length,
      );
    });
  });

  describe('Pagination', () => {
    const itemsPaginated = [itemMock(), itemMock()];
    const itemsCollectionPaginated = apiCollectionPaginated<Item>({
      data: itemsPaginated,
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
    });

    beforeEach(async () => {
      (useLoaderData as jest.Mock)
        .mockClear()
        .mockReturnValue(itemsCollectionPaginated);
      fireEvent.click(
        wrapper.getAllByTestId('search-results__pagination__item')[2],
      );
    });

    test('Renders the correct amount of search results', () => {
      expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
        itemsPaginated.length,
      );
    });
  });

  describe('Filtering', () => {
    const itemsFiltered = [itemMock()];
    const itemsCollectionFiltered = apiCollectionPaginated<Item>({
      data: itemsFiltered,
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
    });

    beforeEach(async () => {
      const locationBasic = locationBasicMock();
      (locationByGooglePlaceID as jest.Mock).mockClear().mockResolvedValue({
        data: locationBasic,
        status: 200,
      });

      (useLoaderData as jest.Mock)
        .mockClear()
        .mockReturnValue(itemsCollectionFiltered);

      fireEvent.change(wrapper.getByTestId('search__filters--query'), {
        target: { value: '' },
      });

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

      await waitFor(() => expect(autocomplete).toHaveBeenCalledTimes(1), {
        timeout: 1000,
      });

      await waitFor(() =>
        expect(
          wrapper.queryAllByTestId('place-autocomplete__suggestion').length,
        ).toBeGreaterThanOrEqual(1),
      );
      fireEvent.click(
        wrapper.getAllByTestId('place-autocomplete__suggestion')[0],
      );
      await waitFor(() =>
        expect(wrapper.getByTestId('search__filters--location')).toHaveValue(
          locationBasic.name,
        ),
      );
      fireEvent.blur(wrapper.getByTestId('search__filters--location'));

      fireEvent.click(wrapper.getByTestId('search__filters__filter'));

      await waitFor(() =>
        expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
          itemsFiltered.length,
        ),
      );
    });

    test('Renders the correct amount of search results', () => {
      expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
        itemsFiltered.length,
      );
    });

    describe('When clearing the search', () => {
      beforeEach(async () => {
        (useLoaderData as jest.Mock)
          .mockClear()
          .mockReturnValue(itemsCollection);
        fireEvent.click(wrapper.getByTestId('search__filters__clear'));
        await waitFor(() =>
          expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
            items.length,
          ),
        );
      });

      test('Renders the correct amount of search results', () => {
        expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
          items.length,
        );
      });
    });
  });

  describe('Clicking on an item', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getAllByTestId('search-item__link')[0]);
    });

    test('Directs to the item page', () => {
      expect(wrapper.queryByTestId('item')).toBeInTheDocument();
    });
  });
});

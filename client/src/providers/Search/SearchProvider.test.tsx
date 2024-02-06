import { faker } from '@faker-js/faker';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { SearchOptions } from '~/src/providers/Search/types';
import { fireEvent, render, RenderResult } from '~/src/testing';
import { itemsSearch, ItemsSearchOptions } from '~/src/urls';

import { useSearch } from './index';

const TestComponent: React.FC = () => {
  const [searchOptions, setSearchOptions] = React.useState<SearchOptions>({});

  const location = useLocation();
  const { filters, page, query, search } = useSearch();

  const onSubmit = React.useCallback(() => {
    search(searchOptions);
  }, [search, searchOptions]);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchOptions(JSON.parse(event.target.value) as SearchOptions);
    },
    [setSearchOptions],
  );

  return (
    <React.Fragment>
      <p data-testid="filter__url">
        {location.pathname}
        {location.search}
      </p>
      <p data-testid="filter__location--distance">{filters.distance}</p>
      <p data-testid="filter__location--google-place-id">
        {filters.googlePlaceID}
      </p>
      <p data-testid="filter__page">{page}</p>
      <p data-testid="filter__query">{query}</p>
      <p data-testid="filter__tag-ids">
        {filters.tagIDs ? JSON.stringify(filters.tagIDs) : null}
      </p>
      <input data-testid="search__filters" onChange={onChange} type="text" />
      <button data-testid="search" onClick={onSubmit} type="button">
        Search
      </button>
    </React.Fragment>
  );
};

describe('When loading the search page', () => {
  const itemsSearchOptions: ItemsSearchOptions = {
    distance: faker.number.int(),
    location: faker.string.uuid(),
    page: faker.number.int({ max: 10, min: 1 }),
    perPage: faker.number.int({ max: 50, min: 1 }),
    query: faker.word.sample(),
    tag: [faker.number.int(), faker.number.int()],
  };

  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <Routes>
        <Route element={<TestComponent />} path={itemsSearch()} />
      </Routes>,
      {
        router: { initialEntries: [itemsSearch(itemsSearchOptions)] },
      },
    );
  });

  test('Loads the distance from the URL', () => {
    expect(
      wrapper.queryByTestId('filter__location--distance'),
    ).toHaveTextContent(itemsSearchOptions.distance!.toString());
  });

  test('Loads the Google Place ID from the URL', () => {
    expect(
      wrapper.queryByTestId('filter__location--google-place-id'),
    ).toHaveTextContent(itemsSearchOptions.location!.toString());
  });

  test('Loads the page from the URL', () => {
    expect(wrapper.queryByTestId('filter__page')).toHaveTextContent(
      itemsSearchOptions.page!.toString(),
    );
  });

  test('Loads the query from the URL', () => {
    expect(wrapper.queryByTestId('filter__query')).toHaveTextContent(
      itemsSearchOptions.query!,
    );
  });

  test('Loads the Tag IDs from the URL', () => {
    expect(wrapper.queryByTestId('filter__tag-ids')).toHaveTextContent(
      JSON.stringify(itemsSearchOptions.tag!),
    );
  });

  describe('When updating something other than the location/distance', () => {
    const fullFilters: SearchOptions = {
      query: faker.word.sample(),
    };

    const itemsSearchOptionsUpdated: ItemsSearchOptions = {
      distance: itemsSearchOptions.distance,
      location: itemsSearchOptions.location,
      query: fullFilters.query,
    };

    beforeEach(() => {
      fireEvent.change(wrapper.getByTestId('search__filters'), {
        target: { value: JSON.stringify(fullFilters) },
      });
      fireEvent.click(wrapper.getByTestId('search'));
    });

    test('Updates the URL', () => {
      expect(wrapper.queryByTestId('filter__url')).toHaveTextContent(
        itemsSearch(itemsSearchOptionsUpdated),
      );
    });
  });

  describe('When updating all the filters', () => {
    const fullSearch: SearchOptions = {
      filters: {
        distance: faker.number.int(),
        googlePlaceID: faker.string.uuid(),
        tagIDs: [faker.number.int(), faker.number.int()],
      },
      page: faker.number.int({ max: 100, min: 1 }),
      query: faker.word.sample(),
    };

    const itemsSearchOptionsUpdated: ItemsSearchOptions = {
      distance: fullSearch.filters?.distance,
      location: fullSearch.filters?.googlePlaceID,
      page: fullSearch.page,
      query: fullSearch.query,
      tag: fullSearch.filters?.tagIDs,
    };

    beforeEach(() => {
      fireEvent.change(wrapper.getByTestId('search__filters'), {
        target: { value: JSON.stringify(fullSearch) },
      });
      fireEvent.click(wrapper.getByTestId('search'));
    });

    test('Updates the URL', () => {
      expect(wrapper.queryByTestId('filter__url')).toHaveTextContent(
        itemsSearch(itemsSearchOptionsUpdated),
      );
    });
  });

  describe('With no filters', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('search'));
    });

    test('Updates the URL', () => {
      expect(wrapper.queryByTestId('filter__url')).toHaveTextContent(
        itemsSearch(),
      );
    });
  });
});

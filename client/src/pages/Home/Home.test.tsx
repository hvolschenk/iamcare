import React from 'react';
import { Route, Routes } from 'react-router-dom';

import itemsSearch from '~/src/api/items/search';
import locationsPopular from '~/src/api/locations/popular';
import tagsPopular from '~/src/api/tag/popular';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import {
  item as itemMock,
  locationBasic as locationBasicMock,
  tag as tagMock,
} from '~/src/testing/mocks';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';
import { LocationBasic } from '~/src/types/LocationBasic';
import { Tag } from '~/src/types/Tag';
import {
  authentication,
  itemsSearch as itemsSearchURL,
  root,
  userItemsCreate,
} from '~/src/urls';

import Home from './index';

jest.mock('~/src/api/items/search');
jest.mock('~/src/api/locations/popular');
jest.mock('~/src/api/tag/popular');

describe('When the API calls fail', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (itemsSearch as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to search'));
    (locationsPopular as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch locations'));
    (tagsPopular as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch tags'));
    wrapper = render(
      <Routes>
        <Route element={<Home />} path={root()} />
        <Route
          element={<div data-testid="user-items-create" />}
          path={userItemsCreate()}
        />
        <Route
          element={<div data-testid="search-page" />}
          path={itemsSearchURL()}
        />
      </Routes>,
      { router: { initialEntries: [root()] } },
    );
    await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(locationsPopular).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(tagsPopular).toHaveBeenCalledTimes(1));
  });

  test("Shows the error for the 'latest' section", () => {
    expect(
      wrapper.queryByTestId('home__latest__error__retry'),
    ).toBeInTheDocument();
  });

  test("Shows the error for the 'locations' section", () => {
    expect(
      wrapper.queryByTestId('home__locations__error__retry'),
    ).toBeInTheDocument();
  });

  test("Shows the error for the 'tags' section", () => {
    expect(
      wrapper.queryByTestId('home__tags__error__retry'),
    ).toBeInTheDocument();
  });

  describe("Retrying the 'latest' section", () => {
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
      fireEvent.click(wrapper.getByTestId('home__latest__error__retry'));
      await waitFor(() => expect(itemsSearch).toHaveBeenCalledTimes(1));
    });

    test('Shows the correct amount if items', () => {
      expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
        items.length,
      );
    });
  });

  describe("Retrying the 'locations' section", () => {
    const locations = [
      locationBasicMock(),
      locationBasicMock(),
      locationBasicMock(),
    ];
    const locationsCollection: APICollectionPaginated<LocationBasic> = {
      data: locations,
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
      (locationsPopular as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: locationsCollection, status: 200 });
      fireEvent.click(wrapper.getByTestId('home__locations__error__retry'));
      await waitFor(() => expect(locationsPopular).toHaveBeenCalledTimes(1));
    });

    test('Shows the correct amount of locations', () => {
      expect(
        wrapper.queryAllByTestId('home__locations__location'),
      ).toHaveLength(locations.length);
    });

    describe('Clicking on a location', () => {
      beforeEach(() => {
        fireEvent.click(wrapper.getAllByTestId('home__locations__location')[0]);
      });

      test('Redirects to the search page', () => {
        expect(wrapper.queryByTestId('search-page')).toBeInTheDocument();
      });
    });
  });

  describe("Retrying the 'tags' section", () => {
    const tags = [tagMock(), tagMock(), tagMock()];
    const tagsCollection: APICollectionPaginated<Tag> = {
      data: tags,
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
      (tagsPopular as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: tagsCollection, status: 200 });
      fireEvent.click(wrapper.getByTestId('home__tags__error__retry'));
      await waitFor(() => expect(tagsPopular).toHaveBeenCalledTimes(1));
    });

    test('Renders the correct amount of tags', () => {
      expect(wrapper.queryAllByTestId('home__tags__tag')).toHaveLength(
        tags.length,
      );
    });

    describe('Clicking on a tag', () => {
      beforeEach(() => {
        fireEvent.click(wrapper.getAllByTestId('home__tags__tag')[0]);
      });

      test('Redirects to the search page', () => {
        expect(wrapper.queryByTestId('search-page')).toBeInTheDocument();
      });
    });
  });

  describe("Clicking the 'search for items' action", () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('home__banner__search'));
    });

    test('Opens the search dialog', () => {
      expect(wrapper.queryByTestId('search__input')).toBeInTheDocument();
    });
  });

  describe("Clicking the 'create item' action", () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('home__banner__create'));
    });

    test('Redirects to the user item creation page', () => {
      expect(wrapper.queryByTestId('user-items-create')).toBeInTheDocument();
    });
  });
});

describe('Without a logged in user', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <Routes>
        <Route element={<Home />} path={root()} />
        <Route
          element={<div data-testid="authentication" />}
          path={authentication({})}
        />
      </Routes>,
      { router: { initialEntries: [root()] }, user: null },
    );
  });

  describe("Clicking the 'create item' action", () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('home__banner__create'));
    });

    test('Redirects to the authentication page', () => {
      expect(wrapper.queryByTestId('authentication')).toBeInTheDocument();
    });
  });
});

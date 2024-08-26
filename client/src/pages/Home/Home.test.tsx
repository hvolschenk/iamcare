import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { type RenderResult, fireEvent, renderRouter } from '~/src/testing';
import {
  apiCollectionPaginated,
  item as itemMock,
  locationBasic as locationBasicMock,
  tag as tagMock,
} from '~/src/testing/mocks';
import type { Item } from '~/src/types/Item';
import type { LocationBasic } from '~/src/types/LocationBasic';
import type { Tag } from '~/src/types/Tag';
import {
  authentication,
  itemsSearch as itemsSearchURL,
  root,
  userItemsCreate,
} from '~/src/urls';

import { Component as Home } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/items/search');
jest.mock('~/src/api/locations/popular');
jest.mock('~/src/api/tag/popular');

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

const locations = [
  locationBasicMock(),
  locationBasicMock(),
  locationBasicMock(),
];
const locationsCollection = apiCollectionPaginated<LocationBasic>({
  data: locations,
});

const tags = [tagMock(), tagMock(), tagMock()];
const tagsCollection = apiCollectionPaginated<Tag>({ data: tags });

describe('Rendering', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue({
      items: itemsCollection,
      locations: locationsCollection,
      tags: tagsCollection,
    });
    wrapper = renderRouter(
      [
        { Component: Home, path: root() },
        {
          element: <div data-testid="user-items-create" />,
          path: userItemsCreate(),
        },
        { element: <div data-testid="search-page" />, path: itemsSearchURL() },
      ],
      [root()],
    );
  });

  test('Shows the correct amount of items', () => {
    expect(wrapper.queryAllByTestId('search-item')).toHaveLength(items.length);
  });

  test('Shows the correct amount of locations', () => {
    expect(wrapper.queryAllByTestId('home__locations__location')).toHaveLength(
      locations.length,
    );
  });

  describe('Clicking on a location', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getAllByTestId('home__locations__location')[0]);
    });

    test('Redirects to the search page', () => {
      expect(wrapper.queryByTestId('search-page')).toBeInTheDocument();
    });
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
    wrapper = renderRouter(
      [
        { Component: Home, path: root() },
        {
          element: <div data-testid="authentication" />,
          path: authentication({}),
        },
      ],
      [root()],
      { user: null },
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

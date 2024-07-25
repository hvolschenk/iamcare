import { faker } from '@faker-js/faker';
import React from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';

import itemUpdate from '~/src/api/items/update';
import locationByGooglePlaceID from '~/src/api/locations/google';
import tags from '~/src/api/tag/all';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import {
  fireEvent,
  renderRouter,
  RenderResult,
  testUser,
  waitFor,
  within,
} from '~/src/testing';
import {
  autocompleteResponse as autocompleteResponseMock,
  item as itemMock,
  tag as tagMock,
} from '~/src/testing/mocks';
import { item, userItems, userItemsItem } from '~/src/urls';

import { Component as UserItem } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
    useRouteLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/items/get');
jest.mock('~/src/api/items/update');
jest.mock('~/src/api/locations/google');
jest.mock('~/src/api/tag/all');

const mockItem = itemMock();
const tagsList = [tagMock(), tagMock(), tagMock(), ...mockItem.tags];

beforeEach(() => {
  (tags as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: { data: tagsList }, status: 200 });
  (useRouteLoaderData as jest.Mock).mockClear().mockReturnValue(testUser);
});

describe('When the user does not own this item', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(mockItem);
    wrapper = renderRouter(
      [
        { Component: UserItem, path: userItemsItem() },
        { element: <div data-testid="item-page" />, path: item() },
        { element: <div data-testid="user-items" />, path: userItems() },
      ],
      [userItemsItem(testUser.id.toString(), mockItem.id.toString())],
    );
    await waitFor(() =>
      expect(wrapper.queryByTestId('item-page')).toBeInTheDocument(),
    );
  });

  test('Redirects to the public item page', () => {
    expect(wrapper.queryByTestId('item-page')).toBeInTheDocument();
  });
});

describe('When the user owns this item', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (locationByGooglePlaceID as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: mockItem.location, status: 200 });
    (useLoaderData as jest.Mock)
      .mockClear()
      .mockReturnValue({ ...mockItem, user: testUser });
    wrapper = renderRouter(
      [
        { Component: UserItem, path: userItemsItem() },
        { element: <div data-testid="item-page" />, path: item() },
        { element: <div data-testid="user-items" />, path: userItems() },
      ],
      [userItemsItem(testUser.id.toString(), mockItem.id.toString())],
    );
    await waitFor(() =>
      expect(wrapper.queryByTestId('item-form')).toBeInTheDocument(),
    );
  });

  test('Renders the item form', () => {
    expect(wrapper.queryByTestId('item-form')).toBeInTheDocument();
  });

  describe('After updating the item', () => {
    beforeEach(async () => {
      const autocompleteResponse = autocompleteResponseMock();
      const { autocomplete } = useGooglePlaces();
      (autocomplete as jest.Mock)
        .mockClear()
        .mockResolvedValue(autocompleteResponse);
      (itemUpdate as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: itemMock(), status: 200 });

      const name = faker.word.sample();
      fireEvent.change(wrapper.getByTestId('item-form__name'), {
        target: { value: name },
      });
      await waitFor(() =>
        expect(wrapper.queryByTestId('item-form__name')).toHaveValue(name),
      );
      fireEvent.change(wrapper.getByTestId('item-form__description'), {
        target: { value: faker.word.words() },
      });

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
      fireEvent.click(wrapper.getAllByTestId('tags-select__option')[1]);

      fireEvent.change(wrapper.getByTestId('item-form__location'), {
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
        expect(wrapper.getByTestId('item-form__location')).toHaveValue(
          autocompleteResponse.predictions[0].structured_formatting.main_text,
        ),
      );
      fireEvent.blur(wrapper.getByTestId('item-form__location'));

      fireEvent.click(
        wrapper.getAllByTestId('file-upload__uploaded-item__remove')[0],
      );

      const file = new File(['<3'], 'heart.png', { type: 'image/png' });
      fireEvent.change(wrapper.getByTestId('item-form__image-upload'), {
        target: { files: [file] },
      });
      await waitFor(() =>
        expect(
          wrapper.queryAllByTestId('file-upload__uploaded-item').length,
        ).toBeGreaterThanOrEqual(1),
      );

      fireEvent.click(wrapper.getByTestId('item-form__action--submit'));
      await waitFor(() => expect(itemUpdate).toHaveBeenCalledTimes(1));
    });

    test('Redirects to the user items page', () => {
      expect(wrapper.queryByTestId('user-items')).toBeInTheDocument();
    });
  });
});

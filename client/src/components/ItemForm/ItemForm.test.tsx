// This test should only remain
// until the update page exists and has it's own test.
import React from 'react';

import categories from '~/src/api/category/all';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { Category } from '~/src/types/Category';
import { Item } from '~/src/types/Item';

import ItemForm from './index';

jest.mock('~/src/api/category/all');

const categoriesList: Category[] = [
  { id: 1, name: 'Love' },
  { id: 2, name: 'Care' },
  { id: 3, name: 'Respect' },
];
const item: Item = {
  category: {
    id: 22,
    name: 'Care',
  },
  description: 'I am care',
  id: 22,
  images: [],
  location: {
    id: 22,
    namePrimary: 'Centurion',
    nameSecondary: 'South Africa',
    placeID: '22',
  },
  name: 'Care',
  user: {
    email: 'carer@iamcare.co.za',
    id: 22,
    name: 'Carer',
  },
};
const onSuccess = jest.fn();

let wrapper: RenderResult;

beforeEach(async () => {
  (categories as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: categoriesList, status: 200 });
  wrapper = render(
    <ItemForm item={item} labelActionPrimary="Update" onSuccess={onSuccess} />,
  );
  await waitFor(() => expect(categories).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(wrapper.queryByTestId('item-form')).toBeInTheDocument(),
  );
  fireEvent.click(wrapper.getByTestId('item-form__action--submit'));
  await waitFor(() =>
    expect(
      wrapper.queryByTestId('item-form__action--submit'),
    ).not.toBeDisabled(),
  );
});

test('Renders the item form', () => {
  expect(wrapper.queryByTestId('item-form')).toBeInTheDocument();
});

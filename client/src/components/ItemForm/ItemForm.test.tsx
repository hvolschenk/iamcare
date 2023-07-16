// This test should only remain
// until the update page exists and has it's own test.
import React from 'react';

import categories from '~/src/api/category/all';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import {
  category as categoryMock,
  item as itemMock,
} from '~/src/testing/mocks';

import ItemForm from './index';

jest.mock('~/src/api/category/all');

const categoriesList = [categoryMock(), categoryMock(), categoryMock()];
const item = itemMock();
const onSuccess = jest.fn();

let wrapper: RenderResult;

beforeEach(async () => {
  (categories as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: { data: categoriesList }, status: 200 });
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

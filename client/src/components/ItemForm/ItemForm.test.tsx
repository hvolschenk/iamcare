// This test should only remain
// until the update page exists and has it's own test.
import React from 'react';

import tags from '~/src/api/tag/all';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { item as itemMock, tag as tagMock } from '~/src/testing/mocks';

import ItemForm from './index';

jest.mock('~/src/api/tag/all');

const tagsList = [tagMock(), tagMock(), tagMock()];
const item = itemMock();
const onSuccess = jest.fn();

let wrapper: RenderResult;

beforeEach(async () => {
  (tags as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: { data: tagsList }, status: 200 });
  wrapper = render(
    <ItemForm item={item} labelActionPrimary="Update" onSuccess={onSuccess} />,
  );
  await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
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

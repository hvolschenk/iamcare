import { faker } from '@faker-js/faker';
import React from 'react';

import tags from '~/src/api/tag/all';
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '~/src/testing';
import { tag as tagMock } from '~/src/testing/mocks';

import TagsSelect from './index';

jest.mock('~/src/api/tag/all');

describe('When the API call fails', () => {
  const onChange = jest.fn();
  const tagsList = [tagMock(), tagMock(), tagMock(), tagMock()];

  let wrapper: RenderResult;

  beforeEach(async () => {
    (tags as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch'));
    wrapper = render(
      <TagsSelect
        inputProps={{ 'data-testid': 'tags' }}
        label={faker.word.sample()}
        onChange={onChange}
        tagIDs={[tagsList[0].id, tagsList[1].id]}
      />,
    );
    await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('tags-autocomplete__error__retry'),
      ).toBeInTheDocument(),
    );
  });

  test('Renders a retry button', () => {
    expect(
      wrapper.queryByTestId('tags-autocomplete__error__retry'),
    ).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    beforeEach(async () => {
      (tags as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: { data: tagsList }, status: 200 });
      fireEvent.click(wrapper.getByTestId('tags-autocomplete__error__retry'));
      await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(wrapper.queryByTestId('tags')).not.toBeDisabled(),
      );
    });

    test('Enables the dropdown', () => {
      expect(wrapper.queryByTestId('tags')).not.toBeDisabled();
    });

    describe('When (de)selecting some options', () => {
      beforeEach(async () => {
        onChange.mockClear();
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
        fireEvent.click(wrapper.getAllByTestId('tags-select__option')[2]);
        await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
      });

      test('Calls the onChange handler with the selected items', () => {
        expect(onChange.mock.calls[0][0]).toEqual([
          tagsList[0],
          tagsList[1],
          tagsList[2],
        ]);
      });
    });
  });
});

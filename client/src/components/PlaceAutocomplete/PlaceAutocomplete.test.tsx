import React from 'react';

import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';

import PlaceAutocomplete from './index';

const onChange = jest.fn();

const autocompleteResponse: google.maps.places.AutocompleteResponse = {
  predictions: [
    {
      description: 'A caring place',
      matched_substrings: [{ length: 4, offset: 1 }],
      place_id: '22',
      structured_formatting: {
        main_text: 'Care',
        main_text_matched_substrings: [{ length: 4, offset: 1 }],
        secondary_text: 'Care',
      },
      terms: [
        {
          offset: 1,
          value: 'Care',
        },
      ],
      types: ['sublocality'],
    },
    {
      description: 'A loving place',
      matched_substrings: [{ length: 4, offset: 1 }],
      place_id: '222',
      structured_formatting: {
        main_text: 'Love',
        main_text_matched_substrings: [{ length: 4, offset: 1 }],
        secondary_text: 'Love',
      },
      terms: [
        {
          offset: 1,
          value: 'Love',
        },
      ],
      types: ['sublocality'],
    },
  ],
};

describe('When searching for a place', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    wrapper = render(
      <PlaceAutocomplete
        FormHelperTextProps={{
          // @ts-ignore
          'data-testid': 'helper-text',
        }}
        helperText="I am care"
        inputProps={{ 'data-testid': 'input' }}
        label="Care"
        name="care"
        onChange={onChange}
      />,
    );
    onChange.mockClear();
    const { autocomplete } = useGooglePlaces();
    (autocomplete as jest.Mock)
      .mockClear()
      .mockResolvedValue(autocompleteResponse);
    fireEvent.change(wrapper.getByTestId('input'), { target: { value: 'Ca' } });
    fireEvent.change(wrapper.getByTestId('input'), {
      target: { value: 'Care' },
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
  });

  test('Calls the change handler with the correct place ID', () => {
    expect(onChange).toHaveBeenCalledWith(
      autocompleteResponse.predictions[0].place_id,
    );
  });

  describe('When clearning the search again', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('place-autocomplete__clear'));
    });

    test('Calls the change handler without a place ID', () => {
      expect(onChange).toHaveBeenCalledWith('');
    });
  });
});

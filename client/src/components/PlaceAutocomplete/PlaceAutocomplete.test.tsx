import React from 'react';

import locationByGooglePlaceID from '~/src/api/locations/google';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import {
  autocompleteResponse as autocompleteResponseMock,
  locationBasic as locationBasicMock,
} from '~/src/testing/mocks';

import PlaceAutocomplete from './index';

jest.mock('~/src/api/locations/google');

const locationBasic = locationBasicMock();
const onChange = jest.fn();

const autocompleteResponse = autocompleteResponseMock();

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

  describe('When the selected value changes through props', () => {
    beforeEach(async () => {
      (locationByGooglePlaceID as jest.Mock).mockClear().mockResolvedValue({
        data: locationBasic,
        status: 200,
      });
      wrapper.rerender(
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
          value={autocompleteResponse.predictions[0].place_id}
        />,
      );
      await waitFor(() =>
        expect(locationByGooglePlaceID).toHaveBeenCalledTimes(1),
      );
      await waitFor(() =>
        expect(wrapper.queryByTestId('input')).toHaveValue(locationBasic.name),
      );
    });

    test('Has the value from the API auto selected', () => {
      expect(wrapper.queryByTestId('input')).toHaveValue(locationBasic.name);
    });
  });
});

describe('When given a place ID initially', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (locationByGooglePlaceID as jest.Mock).mockClear().mockResolvedValue({
      data: locationBasic,
      status: 200,
    });
    wrapper = render(
      <PlaceAutocomplete
        helperText="I am care"
        inputProps={{ 'data-testid': 'input' }}
        label="Care"
        name="care"
        onChange={onChange}
        value={locationBasic.googlePlaceID}
      />,
    );
    await waitFor(() =>
      expect(locationByGooglePlaceID).toHaveBeenCalledTimes(1),
    );
    await waitFor(() =>
      expect(wrapper.queryByTestId('input')).toHaveValue(locationBasic.name),
    );
  });

  test('Has the value from the API auto selected', () => {
    expect(wrapper.queryByTestId('input')).toHaveValue(locationBasic.name);
  });

  describe('When typing in the search box after', () => {
    beforeEach(async () => {
      onChange.mockClear();
      const { autocomplete } = useGooglePlaces();
      (autocomplete as jest.Mock)
        .mockClear()
        .mockResolvedValue(autocompleteResponse);
      fireEvent.change(wrapper.getByTestId('input'), {
        target: { value: 'Ca' },
      });
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
  });
});

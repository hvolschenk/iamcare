import { Loader } from '@googlemaps/js-api-loader';
import React from 'react';

import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';

import { Provider, useGooglePlaces } from './index';

jest.mock('@googlemaps/js-api-loader');
jest.unmock('~/src/providers/GooglePlaces/Provider');
jest.unmock('~/src/providers/GooglePlaces/useGooglePlaces');

const Consumer: React.FC = () => {
  const [predictions, setPredictions] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const { autocomplete, generateAutocompleteSessionToken } = useGooglePlaces();
  const onClick = React.useCallback(async () => {
    const result = await autocomplete(
      'Care',
      generateAutocompleteSessionToken(),
    );
    setPredictions(result.predictions);
  }, [autocomplete, generateAutocompleteSessionToken]);
  return (
    <React.Fragment>
      {predictions.map((prediction) => (
        <div data-testid="prediction" key={prediction.place_id} />
      ))}
      <button data-testid="get" onClick={onClick} type="button">
        Get
      </button>
    </React.Fragment>
  );
};

const predictions: google.maps.places.AutocompletePrediction[] = [
  {
    description: 'A caring place',
    matched_substrings: [{ length: 4, offset: 0 }],
    place_id: '22',
    structured_formatting: {
      main_text: 'A caring place',
      main_text_matched_substrings: [{ length: 4, offset: 0 }],
      secondary_text: 'Care',
    },
    terms: [{ offset: 0, value: 'Care' }],
    types: ['sublocality'],
  },
];

const generateToken = jest.fn().mockImplementation(() => 'TOKEN');
const getPlacePredictions = jest.fn().mockResolvedValue({ predictions });
const service = jest.fn().mockImplementation(() => ({ getPlacePredictions }));
const load = jest.fn().mockResolvedValue({
  maps: {
    places: {
      AutocompleteService: service,
      AutocompleteSessionToken: generateToken,
    },
  },
});

let wrapper: RenderResult;

beforeEach(async () => {
  getPlacePredictions.mockClear();
  load.mockClear();
  (Loader as unknown as jest.Mock).mockImplementation(() => ({ load }));
  wrapper = render(
    <Provider>
      <Consumer />
    </Provider>,
  );
  await waitFor(() => expect(load).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(wrapper.getByTestId('get')).toBeInTheDocument());
  fireEvent.click(wrapper.getByTestId('get'));
  await waitFor(() => expect(getPlacePredictions).toHaveBeenCalledTimes(1));
});

test('Returns the correct predictions', () => {
  expect(wrapper.queryAllByTestId('prediction')).toHaveLength(
    predictions.length,
  );
});

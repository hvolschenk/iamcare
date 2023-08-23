import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete, {
  AutocompleteInputChangeReason,
} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useMutation, useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import React from 'react';

import locationByGooglePlaceID from '~/src/api/locations/google';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import { LocationBasic } from '~/src/types/LocationBasic';

export interface PlaceAutocompleteProps {
  error?: TextFieldProps['error'];
  FormHelperTextProps?: TextFieldProps['FormHelperTextProps'];
  helperText?: TextFieldProps['helperText'];
  inputProps?: TextFieldProps['inputProps'];
  label: TextFieldProps['label'];
  margin?: TextFieldProps['margin'];
  name?: TextFieldProps['name'];
  onChange(googlePlaceID: string): void;
  value?: LocationBasic['googlePlaceID'];
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  error,
  FormHelperTextProps,
  helperText,
  inputProps,
  label,
  margin = 'none',
  name,
  onChange,
  value,
}) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedValue, setSelectedValue] =
    React.useState<google.maps.places.AutocompletePrediction | null>(null);

  const isQueryEnabled = React.useMemo<boolean>(() => Boolean(value), [value]);
  const {
    data,
    isLoading: isQueryLoading,
    isSuccess,
  } = useQuery(
    ['location', 'google', value],
    () => locationByGooglePlaceID({ googlePlaceID: value! }),
    { enabled: isQueryEnabled },
  );

  React.useEffect(() => {
    if (isSuccess) {
      const prediction: google.maps.places.AutocompletePrediction = {
        description: data.data.address,
        matched_substrings: [],
        place_id: data.data.googlePlaceID,
        structured_formatting: {
          main_text: data.data.name,
          main_text_matched_substrings: [],
          secondary_text: data.data.address,
        },
        terms: [],
        types: [],
      };
      setOptions((currentOptions) => [prediction, ...currentOptions]);
      setSelectedValue(prediction);
    }
  }, [data, isSuccess, setOptions, setSelectedValue]);

  const { autocomplete, generateAutocompleteSessionToken } = useGooglePlaces();

  const { mutate } = useMutation(
    ['google', 'places', 'autocomplete'],
    (query: string) => autocomplete(query, generateAutocompleteSessionToken()),
    {
      onSettled: () => {
        setIsLoading(false);
      },
      onSuccess: (response) => {
        setOptions(response.predictions);
      },
    },
  );

  const mutateDebounced = debounce(mutate, 500);

  const handleChange = React.useCallback(
    (
      event: React.SyntheticEvent<Element, Event>,
      autocompletePrediction: google.maps.places.AutocompletePrediction | null,
    ) => {
      if (autocompletePrediction) {
        setSelectedValue(autocompletePrediction);
        if (onChange) {
          onChange(autocompletePrediction.place_id);
        }
      } else {
        setSelectedValue(null);
        if (onChange) {
          onChange('');
        }
      }
    },
    [onChange, setSelectedValue],
  );

  const onInputChange = React.useCallback(
    (
      event: React.SyntheticEvent<Element, Event>,
      query: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      setInputValue(query);
      if (reason === 'input') {
        if (query.length < 3) {
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        mutateDebounced(query);
      }
    },
    [mutateDebounced, setInputValue, setIsLoading],
  );

  return (
    <Autocomplete<google.maps.places.AutocompletePrediction>
      clearIcon={
        <ClearIcon data-testid="place-autocomplete__clear" fontSize="small" />
      }
      disabled={isQueryLoading && isQueryEnabled}
      filterOptions={(x) => x}
      getOptionLabel={(autocompletePrediction) =>
        autocompletePrediction.structured_formatting.main_text
      }
      inputValue={inputValue}
      loading={isLoading || (isQueryLoading && isQueryEnabled)}
      onChange={handleChange}
      onInputChange={onInputChange}
      options={options}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          error={error}
          FormHelperTextProps={FormHelperTextProps}
          fullWidth
          helperText={helperText}
          inputProps={{ ...params.inputProps, ...inputProps }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          label={label}
          margin={margin}
          name={name}
        />
      )}
      renderOption={(props, option) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <ListItem {...props} data-testid="place-autocomplete__suggestion">
          <ListItemText
            primary={option.structured_formatting.main_text}
            secondary={option.structured_formatting.secondary_text}
          />
        </ListItem>
      )}
      value={selectedValue}
    />
  );
};

export default PlaceAutocomplete;

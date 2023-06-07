import Autocomplete from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React from 'react';

import { Category } from '~/src/types/Category';

interface CategoryAutocompleteProps {
  categories: Category[];
  error?: TextFieldProps['error'];
  FormHelperTextProps?: TextFieldProps['FormHelperTextProps'];
  helperText?: TextFieldProps['helperText'];
  inputProps?: TextFieldProps['inputProps'];
  label: TextFieldProps['label'];
  name?: TextFieldProps['name'];
  onChange(category: string): void;
}

const CategoryAutocomplete: React.FC<CategoryAutocompleteProps> = ({
  categories,
  error,
  FormHelperTextProps,
  helperText,
  inputProps,
  label,
  name,
  onChange,
}) => {
  const categoryStrings: string[] = React.useMemo(
    () => categories.map((category) => category.name),
    [categories],
  );

  const handleChange = React.useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: string | null) => {
      if (value) {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <Autocomplete
      autoSelect
      onChange={handleChange}
      freeSolo
      options={categoryStrings}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          error={error}
          FormHelperTextProps={FormHelperTextProps}
          fullWidth
          helperText={helperText}
          inputProps={{ ...params.inputProps, ...inputProps }}
          label={label}
          margin="normal"
          name={name}
        />
      )}
    />
  );
};

export default CategoryAutocomplete;

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';

import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';

interface FormValues {
  query: string;
}

const Search: React.FC = () => {
  const { search, query } = useSearch();

  const initialValues = React.useMemo<FormValues>(
    () => ({ query: query || '' }),
    [query],
  );

  const onSubmit: FormikConfig<FormValues>['onSubmit'] = React.useCallback(
    (values) => {
      search({ query: values.query });
    },
    [search],
  );

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    submitForm,
    values,
  } = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues,
    onSubmit,
  });

  const onClear = React.useCallback(async () => {
    await setFieldValue('query', '');
    await submitForm();
  }, [setFieldValue, submitForm]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        if (event.key === 'Enter') {
          submitForm();
        }
      },
      [submitForm],
    );

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <TextField
        fullWidth
        inputProps={{
          'data-testid': 'search__input',
        }}
        InputProps={{
          endAdornment: (
            <React.Fragment>
              {values.query && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={l10n.searchFieldClear}
                    data-testid="search__action--clear"
                    edge="end"
                    onClick={onClear}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )}
              <InputAdornment position="end">
                <IconButton
                  aria-label={l10n.searchFieldLabel}
                  data-testid="search__action--search"
                  disabled={!values.query}
                  edge="end"
                  type="submit"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            </React.Fragment>
          ),
        }}
        label={l10n.searchFieldLabel}
        name="query"
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={l10n.searchFieldPlaceholder}
        value={values.query}
        variant="filled"
      />
    </form>
  );
};

export default Search;

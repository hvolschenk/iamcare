import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';

import l10n from '~/src/l10n';

import { Search } from './types';

interface FormValues {
  query: string;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose(): void;
  onSearch: Search['search'];
  query?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  onSearch,
  query,
}) => {
  const initialValues = React.useMemo<FormValues>(
    () => ({ query: query || '' }),
    [query],
  );

  const onSubmit: FormikConfig<FormValues>['onSubmit'] = React.useCallback(
    (values) => {
      onSearch({ query: values.query });
      onClose();
    },
    [onClose, onSearch],
  );

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues,
    onSubmit,
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={isOpen}>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            // There is an issue where this will not work in development.
            // If it continues to work in production then no real harm.
            // https://github.com/mui/material-ui/issues/33004
            autoFocus
            fullWidth
            inputProps={{
              'data-testid': 'search__input',
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    data-testid="search__action--search"
                    type="submit"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            name="query"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder={l10n.searchFieldPlaceholder}
            value={formik.values.query}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import l10n from '~/src/l10n';
import { itemsSearch } from '~/src/urls';

const Search: React.FC = () => {
  const [urlSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState<string>(
    urlSearchParams.get('query') || '',
  );

  const navigate = useNavigate();

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(
    (event) => {
      setQuery(event.target.value);
    },
    [setQuery],
  );

  const onClear = React.useCallback(() => {
    setQuery('');
  }, [setQuery]);

  const onClick = React.useCallback(() => {
    navigate(itemsSearch({ query }));
  }, [navigate, query]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        if (event.key === 'Enter') {
          onClick();
        }
      },
      [onClick],
    );

  return (
    <TextField
      color="secondary"
      fullWidth
      inputProps={{
        'data-testid': 'search__input',
      }}
      InputProps={{
        endAdornment: (
          <React.Fragment>
            {query && (
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
                disabled={!query}
                edge="end"
                onClick={onClick}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          </React.Fragment>
        ),
      }}
      label={l10n.searchFieldLabel}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={l10n.searchFieldPlaceholder}
      size="small"
      sx={{
        '&:hover': {
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
        },
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
      }}
      value={query}
      variant="filled"
    />
  );
};

export default Search;

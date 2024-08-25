import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import tags from '~/src/api/tag/all';
import { getTagLabel } from '~/src/shared/tags';
import type { Tag } from '~/src/types/Tag';

export interface TagsSelectProps {
  error?: TextFieldProps['error'];
  FormHelperTextProps?: TextFieldProps['FormHelperTextProps'];
  helperText?: TextFieldProps['helperText'];
  inputProps?: TextFieldProps['inputProps'];
  label: TextFieldProps['label'];
  margin?: TextFieldProps['margin'];
  name?: TextFieldProps['name'];
  onChange(tags: Tag[]): void;
  tagIDs: Tag['id'][];
}

const TagsSelect: React.FC<TagsSelectProps> = ({
  error,
  FormHelperTextProps,
  helperText,
  inputProps,
  label,
  margin,
  name,
  onChange,
  tagIDs,
}) => {
  const { data, refetch, status } = useQuery({
    queryFn: () => tags(),
    queryKey: ['tags'],
  });

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<number[]>) => {
      const selectedIDs = event.target.value as number[];
      const selectedTags = selectedIDs.map(
        (selectedID) => data!.data.data.find((tag) => tag.id === selectedID)!,
      );
      onChange(selectedTags);
    },
    [data, onChange],
  );

  return (
    <TextField
      autoComplete="off"
      data-testid="tags-select"
      disabled={status !== 'success'}
      error={error}
      FormHelperTextProps={FormHelperTextProps}
      fullWidth
      helperText={helperText}
      inputProps={inputProps}
      InputProps={{
        endAdornment: (
          <React.Fragment>
            {status === 'error' && (
              <InputAdornment position="end">
                <IconButton
                  data-testid="tags-autocomplete__error__retry"
                  onClick={() => refetch()}
                >
                  <SyncProblemIcon />
                </IconButton>
              </InputAdornment>
            )}
            {status === 'pending' && (
              <InputAdornment position="end">
                <CircularProgress size={24} />
              </InputAdornment>
            )}
          </React.Fragment>
        ),
      }}
      label={label}
      margin={margin}
      name={name}
      select
      SelectProps={{
        'data-testid': 'tags-select__select',
        multiple: true,
        // Unfortunately there is no way to pass a generic for the type here
        // @ts-ignore
        onChange: handleChange,
      }}
      value={tagIDs}
    >
      {status !== 'success' && <MenuItem />}
      {status === 'success' &&
        data.data.data.map((tag) => (
          <MenuItem
            data-testid="tags-select__option"
            key={tag.id}
            value={tag.id}
          >
            {getTagLabel(tag)}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default TagsSelect;

import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import tags from '~/src/api/tag/all';
import l10n from '~/src/l10n';
import { L10n } from '~/src/l10n/types';
import { Tag } from '~/src/types/Tag';

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

  const getOptionLabel = (tag: Tag): string => {
    const title = `${tag.title.charAt(0).toUpperCase()}${tag.title.slice(1)}`;
    const l10nKey: keyof L10n = `itemTag${title}` as keyof L10n;
    return l10n[l10nKey];
  };

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<number[]>) => {
      const { value } = event.target;
      const selectedIDs = typeof value === 'string' ? value.split(',') : value;
      const selectedTags = selectedIDs.map(
        (selectedID) => data?.data.data.find((tag) => tag.id === selectedID)!,
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
        endAdornment:
          status === 'error' ? (
            <InputAdornment position="end">
              <IconButton
                data-testid="tags-autocomplete__error__retry"
                onClick={() => refetch()}
              >
                <SyncProblemIcon />
              </IconButton>
            </InputAdornment>
          ) : undefined,
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
            {getOptionLabel(tag)}
          </MenuItem>
        ))}
      {status !== 'success' && (
        <MenuItem disabled>{l10n.itemTagsStatusLoading}</MenuItem>
      )}
    </TextField>
  );
};

export default TagsSelect;

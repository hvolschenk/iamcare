import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React from 'react';

import PlaceAutocomplete, {
  PlaceAutocompleteProps,
} from '~/src/components/PlaceAutocomplete';
import TagsSelect, { TagsSelectProps } from '~/src/components/TagsSelect';
import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';
import { SearchFilters } from '~/src/providers/Search/types';

const Filters: React.FC = () => {
  const { filters, hasFilter, search } = useSearch();

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    submitForm,
    values,
  } = useFormik<SearchFilters>({
    initialValues: filters,
    onSubmit: (newFilters) => {
      search({ filters: { ...filters, ...newFilters }, page: 1 });
    },
  });

  const onClearSearch = React.useCallback(async () => {
    resetForm({
      values: {
        distance: 0,
        googlePlaceID: '',
        tagIDs: [],
      },
    });
    await submitForm();
  }, [resetForm, submitForm]);

  const onLocationChange: PlaceAutocompleteProps['onChange'] =
    React.useCallback(
      (googlePlaceID) => {
        setFieldValue('googlePlaceID', googlePlaceID);
      },
      [setFieldValue],
    );

  const onTagsChange: TagsSelectProps['onChange'] = React.useCallback(
    (tags) => {
      setFieldValue(
        'tagIDs',
        tags.map((tag) => tag.id.toString()),
      );
    },
    [setFieldValue],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <PlaceAutocomplete
                inputProps={{
                  'data-testid': 'search__filters--location',
                  size: 'small',
                }}
                label={l10n.searchFilterFieldLocation}
                margin="none"
                onChange={onLocationChange}
                value={values.googlePlaceID}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                inputProps={{ 'data-testid': 'search__filters--distance' }}
                label={l10n.searchFilterFieldDistance}
                margin="none"
                name="distance"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.distance}
              >
                <option value="0">{l10n.searchFilterFieldDistanceAny}</option>
                {[10, 25, 50, 100].map((distance) => (
                  <option key={distance} value={distance.toString()}>
                    {l10n.formatString(l10n.searchFilterFieldDistanceLength, {
                      distance,
                    })}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <TagsSelect
                inputProps={{ 'data-testid': 'search__filters__tags' }}
                label={l10n.itemTags}
                onChange={onTagsChange}
                tagIDs={values.tagIDs!}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            data-testid="search__filters__filter"
            fullWidth
            type="submit"
            variant="contained"
          >
            {l10n.searchFilterActionFilter}
          </Button>
        </CardActions>
        {hasFilter && (
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              component="button"
              data-testid="search__filters__clear"
              onClick={onClearSearch}
              type="button"
            >
              {l10n.searchFiltersClear}
            </Link>
          </CardActions>
        )}
      </Card>
    </form>
  );
};

export default Filters;

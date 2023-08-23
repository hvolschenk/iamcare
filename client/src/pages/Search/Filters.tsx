import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React from 'react';

import PlaceAutocomplete, {
  PlaceAutocompleteProps,
} from '~/src/components/PlaceAutocomplete';
import l10n from '~/src/l10n';

import { useSearch } from './context';
import { SearchFilters } from './context/types';

const Filters: React.FC = () => {
  const { filters, setFilters } = useSearch();

  const { handleBlur, handleChange, handleSubmit, setFieldValue, values } =
    useFormik<SearchFilters>({
      initialValues: filters,
      onSubmit: (newFilters) => {
        setFilters(newFilters);
      },
    });

  const onLocationChange: PlaceAutocompleteProps['onChange'] =
    React.useCallback(
      (googlePlaceID) => {
        setFieldValue('location', googlePlaceID);
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
                value={values.location}
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
      </Card>
    </form>
  );
};

export default Filters;

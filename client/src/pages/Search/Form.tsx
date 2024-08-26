import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import React from 'react';

import PlaceAutocomplete, {
  type PlaceAutocompleteProps,
} from '~/src/components/PlaceAutocomplete';
import TagsSelect, { type TagsSelectProps } from '~/src/components/TagsSelect';
import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';
import type { SearchOptions } from '~/src/providers/Search/types';

type FormValues = Required<Pick<SearchOptions, 'filters' | 'query'>>;

const SearchForm: React.FC = () => {
  const { filters, hasFilter, query, search } = useSearch();

  const initialValues = React.useMemo<FormValues>(
    () => ({
      filters,
      query: query || '',
    }),
    [filters, query],
  );

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit: (values) => {
      search({ ...values, page: 1 });
    },
  });

  const onClearSearch = React.useCallback(async () => {
    formik.resetForm({
      values: {
        filters: {
          distance: 0,
          googlePlaceID: '',
          tagIDs: [],
        },
        query: formik.values.query,
      },
    });
    await formik.submitForm();
  }, [formik]);

  const onLocationChange: PlaceAutocompleteProps['onChange'] =
    React.useCallback(
      (googlePlaceID) => {
        formik.setFieldValue('filters.googlePlaceID', googlePlaceID);
      },
      [formik],
    );

  const onTagsChange: TagsSelectProps['onChange'] = React.useCallback(
    (tags) => {
      formik.setFieldValue(
        'filters.tagIDs',
        tags.map((tag) => tag.id.toString()),
      );
    },
    [formik],
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            inputProps={{
              'data-testid': 'search__filters--query',
            }}
            label={l10n.searchFieldLabel}
            margin="none"
            name="query"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.query}
          />
        </CardContent>
        <Accordion>
          <AccordionSummary
            data-testid="search__filters__summary"
            expandIcon={<ExpandMoreIcon />}
          >
            <Stack alignItems="center" direction="row" gap={1}>
              <Badge color="secondary" invisible={!hasFilter} variant="dot">
                <TuneIcon />
              </Badge>
              <Typography>{l10n.searchFilters}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
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
                  value={formik.values.filters.googlePlaceID}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  inputProps={{
                    'data-testid': 'search__filters--distance',
                  }}
                  label={l10n.searchFilterFieldDistance}
                  margin="none"
                  name="filters.distance"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.filters.distance}
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
                  tagIDs={formik.values.filters.tagIDs!}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
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

export default SearchForm;

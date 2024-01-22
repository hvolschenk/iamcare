import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { AxiosError } from 'axios';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

import parseErrors from '~/src/api/helpers/parseErrors';
import itemCreate from '~/src/api/items/create';
import FileUpload, { FileUploadProps } from '~/src/components/FileUpload';
import PlaceAutocomplete, {
  PlaceAutocompleteProps,
} from '~/src/components/PlaceAutocomplete';
import TagsSelect from '~/src/components/TagsSelect';
import l10n from '~/src/l10n';
import { useNotifications } from '~/src/providers/Notifications';
import { APIValidationError } from '~/src/types/APIValidationError';
import { mimeTypes } from '~/src/types/Image';
import { Item, ItemCreate as ItemCreateType } from '~/src/types/Item';
import { Tag } from '~/src/types/Tag';

type FormValues = ItemCreateType;

interface ItemFormProps {
  item?: Item;
  labelActionPrimary: string;
  onSuccess(item: Item): void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  item,
  labelActionPrimary,
  onSuccess,
}) => {
  const { notify } = useNotifications();

  const validationSchema = yup.object({
    description: yup.string(),
    location: yup
      .object({
        googlePlaceID: yup.string(),
      })
      .test({
        message: l10n.itemLocationErrorRequired,
        name: 'location',
        test: (value) => Boolean(value.googlePlaceID),
      }),
    name: yup.string().required(l10n.itemNameErrorRequired),
    tags: yup
      .array()
      .of(yup.number())
      .required(l10n.itemTagsErrorRequired)
      .min(1, l10n.itemTagsErrorRequired),
  });

  const initialValues = React.useMemo<FormValues>(
    () => ({
      description: item?.description || '',
      images: [],
      location: {
        googlePlaceID: item?.location.googlePlaceID || '',
      },
      name: item?.name || '',
      tags: item?.tags.map((tag) => tag.id) || [],
    }),
    [item],
  );

  const onSubmit: FormikConfig<FormValues>['onSubmit'] = React.useCallback(
    async (values, formikBag) => {
      formikBag.setSubmitting(true);
      if (item) {
        // HENDRIK put the update code here
      } else {
        try {
          const response = await itemCreate(values);
          onSuccess(response.data);
        } catch (error) {
          if (
            error instanceof AxiosError &&
            error.response &&
            error.response.status === 422
          ) {
            const parsedErrors = parseErrors<FormValues>(
              (error as AxiosError<APIValidationError<FormValues>>).response!
                .data,
            );
            Object.keys(parsedErrors).forEach((fieldName) => {
              formikBag.setFieldError(fieldName, parsedErrors[fieldName]);
            });
          } else {
            notify({ message: l10n.itemFormErrorCreating });
          }
        }
      }
      formikBag.setSubmitting(false);
    },
    [item, onSuccess],
  );

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    touched,
    values,
  } = useFormik<FormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const fieldHasError = React.useCallback(
    (fieldName: keyof FormValues): boolean =>
      Boolean(touched[fieldName] && errors[fieldName]),
    [errors, touched],
  );

  const fieldGetHelperText = React.useCallback(
    (fieldName: keyof FormValues, helperText: string): string => {
      if (fieldHasError(fieldName)) {
        return errors[fieldName] as string;
      }
      return helperText;
    },
    [errors, fieldHasError],
  );

  const onFilesChange: FileUploadProps['onChange'] = React.useCallback(
    (images) => {
      setFieldValue('images', images);
    },
    [setFieldValue],
  );

  const onLocationChange: PlaceAutocompleteProps['onChange'] =
    React.useCallback(
      (googlePlaceID) => {
        setFieldValue('location', { googlePlaceID });
      },
      [setFieldValue],
    );

  const onTagsChange = React.useCallback(
    (tags: Tag[]) => {
      setFieldValue(
        'tags',
        tags.map((tag) => tag.id),
      );
    },
    [setFieldValue],
  );

  return (
    <Card data-testid="item-form">
      <form onSubmit={handleSubmit}>
        <CardContent>
          <TextField
            error={fieldHasError('name')}
            fullWidth
            helperText={fieldGetHelperText('name', l10n.itemNameHelperText)}
            FormHelperTextProps={{
              // @ts-ignore
              'data-testid': 'item-form__name__helper-text',
            }}
            inputProps={{ 'data-testid': 'item-form__name' }}
            label={l10n.itemNameLabel}
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
          />
          <TextField
            error={fieldHasError('description')}
            FormHelperTextProps={{
              // @ts-ignore
              'data-testid': 'item-form__description__helper-text',
            }}
            fullWidth
            helperText={fieldGetHelperText(
              'description',
              l10n.itemDescriptionHelperText,
            )}
            inputProps={{ 'data-testid': 'item-form__description' }}
            label={l10n.itemDescriptionLabel}
            margin="normal"
            multiline
            name="description"
            onBlur={handleBlur}
            onChange={handleChange}
            rows={4}
            value={values.description}
          />

          <TagsSelect
            error={fieldHasError('tags')}
            FormHelperTextProps={{
              // @ts-ignore
              'data-testid': 'item-form__tags__helper-text',
            }}
            helperText={fieldGetHelperText('tags', l10n.itemTagsHelperText)}
            inputProps={{ 'data-testid': 'item-form__tags' }}
            label={l10n.itemTagsLabel}
            margin="normal"
            name="tags"
            onChange={onTagsChange}
            tagIDs={values.tags}
          />

          <PlaceAutocomplete
            error={fieldHasError('location')}
            FormHelperTextProps={{
              // @ts-ignore
              'data-testid': 'item-form__location__helper-text',
            }}
            // This one is manually checked instead of using the helper
            // as the error is on a sub-field (location.googlePlaceID)
            // but the type system does not see it as a key.
            helperText={
              fieldHasError('location')
                ? (errors.location as string)
                : l10n.itemLocationHelperText
            }
            inputProps={{
              'data-testid': 'item-form__location',
            }}
            label={l10n.itemLocationLabel}
            margin="normal"
            name="location"
            onChange={onLocationChange}
          />
          <FileUpload
            allowedTypes={[...mimeTypes]}
            FormHelperTextProps={{
              // When rendered, `<HelperText />` allows html props,
              // but raw (not as a component) these are not available to TS.
              // @ts-ignore
              'data-testid': 'item-form__images__helper-text',
            }}
            helperText={l10n.itemImagesHelperText}
            inputProps={{
              'data-testid': 'item-form__image-upload',
            }}
            label={l10n.itemImagesLabel}
            labelUploadButton={l10n.itemImagesLabelUpload}
            onChange={onFilesChange}
          />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            data-testid="item-form__action--submit"
            disabled={isSubmitting}
            type="submit"
            variant="contained"
          >
            {labelActionPrimary}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default ItemForm;

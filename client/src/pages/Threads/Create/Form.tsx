import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import parseErrors from '~/src/api/helpers/parseErrors';
import threadCreate from '~/src/api/threads/create';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';
import { APIValidationError } from '~/src/types/APIValidationError';
import { Item } from '~/src/types/Item';
import { threads } from '~/src/urls';

interface FormValues {
  message: string;
}

interface FormProps {
  item: Item;
}

const Form: React.FC<FormProps> = ({ item }) => {
  const { trackCustomEvent } = useGoogleAnalytics();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const queryClient = useQueryClient();

  const initialValues = React.useMemo<FormValues>(() => ({ message: '' }), []);

  const onSubmit: FormikConfig<FormValues>['onSubmit'] = React.useCallback(
    async (formValues, formikBag) => {
      formikBag.setSubmitting(true);
      try {
        await threadCreate({ item: item.id, message: formValues.message });
        trackCustomEvent(
          { action: 'create_thread', category: 'threads' },
          { itemID: item.id },
        );
        notify({ message: l10n.threadCreateSuccess });
        await queryClient.invalidateQueries({
          exact: true,
          queryKey: ['threads'],
        });
        navigate(threads());
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
          notify({ message: l10n.threadCreateError });
        }
      } finally {
        formikBag.setSubmitting(false);
      }
    },
    [navigate, notify, trackCustomEvent],
  );

  const validationSchema = yup.object({
    message: yup
      .string()
      .required(l10n.threadCreateFieldMessageErrorRequired)
      .max(65535, l10n.threadCreateFieldMessageErrorTooLong),
  });

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const fieldHasError = React.useCallback(
    (fieldName: keyof FormValues): boolean =>
      Boolean(formik.touched[fieldName] && formik.errors[fieldName]),
    [formik],
  );

  const fieldGetHelperText = React.useCallback(
    (fieldName: keyof FormValues, helperText: string): string => {
      if (fieldHasError(fieldName)) {
        return formik.errors[fieldName] as string;
      }
      return helperText;
    },
    [fieldHasError, formik],
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        error={fieldHasError('message')}
        FormHelperTextProps={{
          // @ts-ignore
          'data-testid': 'item-form__message__helper-text',
        }}
        fullWidth
        helperText={fieldGetHelperText(
          'message',
          l10n.threadCreateFieldMessageHelperText,
        )}
        inputProps={{ 'data-testid': 'thread-create__field--message' }}
        label={l10n.threadCreateFieldMessageLabel}
        margin="normal"
        multiline
        name="message"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        rows={4}
        value={formik.values.message}
      />
      <Button
        color="primary"
        data-testid="thread-create__action--create"
        disabled={formik.isSubmitting || formik.isValidating}
        fullWidth
        type="submit"
        variant="contained"
      >
        {l10n.threadCreateActionCreate}
      </Button>
    </form>
  );
};

export default Form;

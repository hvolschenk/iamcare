import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

import threadReply from '~/src/api/threads/reply';
import l10n from '~/src/l10n';
import { useNotifications } from '~/src/providers/Notifications';

import { useThread } from './context';

interface FormValues {
  message: string;
}

const ReplyForm: React.FC = () => {
  const initialValues = React.useMemo<FormValues>(() => ({ message: '' }), []);

  const { notify } = useNotifications();
  const { thread, setThread } = useThread();

  const onSubmit: FormikConfig<FormValues>['onSubmit'] = React.useCallback(
    async (values, formikBag) => {
      formikBag.setSubmitting(true);
      try {
        const { data: updatedThread } = await threadReply(thread.id, values);
        setThread(updatedThread);
        notify({ message: l10n.threadReplySuccess });
        formikBag.resetForm();
      } catch (error) {
        notify({ message: l10n.threadReplyError });
      } finally {
        formikBag.setSubmitting(false);
      }
    },
    [notify, setThread, thread],
  );

  const validationSchema = yup.object<FormValues>({
    message: yup.string().required(l10n.threadReplyFieldMessageErrorRequired),
  });

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const isDisabled = React.useMemo<boolean>(
    () => formik.isSubmitting || formik.isValidating,
    [formik],
  );

  if (thread.item.isGiven) {
    return (
      <Alert data-testid="thread__reply__marked-as-given" severity="info">
        {l10n.itemMarkedAsGiven}
      </Alert>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        disabled={isDisabled}
        fullWidth
        inputProps={{
          'data-testid': 'thread__reply--message',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="secondary"
                data-testid="thread__reply__action--primary"
                disabled={isDisabled}
                type="submit"
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        label={l10n.threadReplyFieldMessageLabel}
        multiline
        name="message"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        rows={4}
        value={formik.values.message}
      />
    </form>
  );
};

export default ReplyForm;

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
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';

import { useThread } from './context';

interface FormValues {
  message: string;
}

const ReplyForm: React.FC = () => {
  const initialValues = React.useMemo<FormValues>(() => ({ message: '' }), []);

  const { trackCustomEvent } = useGoogleAnalytics();
  const { notify } = useNotifications();
  const { thread, setThread } = useThread();

  const onSubmit: FormikConfig<FormValues>['onSubmit'] = React.useCallback(
    async (values, formikBag) => {
      formikBag.setSubmitting(true);
      try {
        const { data: updatedThread } = await threadReply(thread.id, values);
        trackCustomEvent(
          { action: 'reply_to_thread', category: 'threads' },
          { threadID: thread.id },
        );
        setThread(updatedThread);
        notify({ message: l10n.threadReplySuccess });
        formikBag.resetForm();
      } catch (error) {
        notify({ message: l10n.threadReplyError });
      } finally {
        formikBag.setSubmitting(false);
      }
    },
    [notify, setThread, thread, trackCustomEvent],
  );

  const validationSchema = yup.object<FormValues>({
    message: yup.string().required(l10n.threadReplyFieldMessageErrorRequired),
  });

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

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
        disabled={formik.isSubmitting}
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
                disabled={formik.isSubmitting || formik.isValidating}
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

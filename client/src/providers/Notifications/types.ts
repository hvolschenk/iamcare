import { SnackbarProps } from '@mui/material/Snackbar';

export interface NotificationsProviderValues {
  notify(notification: SnackbarProps): void;
}

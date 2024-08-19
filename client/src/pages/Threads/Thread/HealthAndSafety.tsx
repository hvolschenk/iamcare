import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { healthAndSafety } from '~/src/urls';

const HealthAndSafety: React.FC = () => (
  <Alert
    action={
      <Button
        color="inherit"
        component={Link}
        data-testid="thread__health-and-safety"
        to={healthAndSafety()}
      >
        {l10n.threadNotificationHealthAndSafetyAction}
      </Button>
    }
    severity="info"
  >
    {l10n.threadNotificationHealthAndSafety}
  </Alert>
);

export default HealthAndSafety;

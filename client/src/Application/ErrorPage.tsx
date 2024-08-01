import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { root } from '~/src/urls';

const ErrorPage: React.FC = () => (
  <Container maxWidth="xl">
    <Typography variant="h3">{l10n.errorPageTitle}</Typography>
    <Alert
      action={
        <Button
          component={Link}
          data-testid="error__action--primary"
          to={root()}
        >
          {l10n.errorPageActionHome}
        </Button>
      }
      severity="error"
    >
      {l10n.errorPageDescription}
    </Alert>
  </Container>
);

export default ErrorPage;

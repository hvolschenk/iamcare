import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { root } from '~/src/urls';

const ApplicationName: React.FC = () => (
  <Typography
    color="inherit"
    component={Link}
    sx={{ textDecoration: 'none' }}
    to={root()}
    variant="h5"
  >
    {l10n.applicationName}
  </Typography>
);

export default ApplicationName;

import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

import logo32x32 from '~/public/images/icons/favicon-32x32.png';
import l10n from '~/src/l10n';
import { root } from '~/src/urls';

const ApplicationName: React.FC = () => (
  <React.Fragment>
    <Link to={root()}>
      <img alt={l10n.applicationName} src={logo32x32} />
    </Link>
    <Typography
      color="inherit"
      component={Link}
      sx={{ marginLeft: (theme) => theme.spacing(1), textDecoration: 'none' }}
      to={root()}
      variant="h5"
    >
      {l10n.applicationName}
    </Typography>
  </React.Fragment>
);

export default ApplicationName;

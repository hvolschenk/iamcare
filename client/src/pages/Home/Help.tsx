import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';

import configuration from '~/src/configuration';
import l10n from '~/src/l10n';

const Help: React.FC = () => (
  <Box textAlign="center">
    <Typography gutterBottom variant="h5">
      {l10n.homeHelpTitle}
    </Typography>
    <Typography gutterBottom>{l10n.homeHelpDescription}</Typography>
    <Button href={configuration.gitHub.url()} startIcon={<GitHubIcon />}>
      {l10n.homeHelpCallToAction}
    </Button>
  </Box>
);

export default Help;

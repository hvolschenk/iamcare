import GitHubIcon from '@mui/icons-material/GitHub';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';

import configuration from '~/src/configuration';
import l10n from '~/src/l10n';

const Footer: React.FC = () => (
  <AppBar
    position="absolute"
    sx={{
      bottom: 0,
      display: { md: 'flex', xs: 'none' },
      marginTop: 5,
      top: 'auto',
    }}
  >
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Box display="flex" flexGrow={1}>
          <Typography>
            &copy; {l10n.applicationName} {new Date().getFullYear()}
          </Typography>
        </Box>
        <Box display="flex">
          <IconButton
            href={configuration.gitHub.url()}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Footer;

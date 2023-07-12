import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container, { ContainerProps } from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import l10n from '~/src/l10n';
import { root } from '~/src/urls';

import UserMenu from './UserMenu';

interface BaseProps {
  containerWidth?: ContainerProps['maxWidth'];
}

const Base: React.FC<BaseProps> = ({ containerWidth = 'lg' }) => (
  <React.Fragment>
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box display="flex" flexGrow={1}>
            <IconButton>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexGrow={1}>
            <Typography
              color="inherit"
              component={Link}
              sx={{ textDecoration: 'none' }}
              to={root()}
              variant="h5"
            >
              {l10n.applicationName}
            </Typography>
          </Box>
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>

    <Container maxWidth={containerWidth}>
      <Toolbar />
      <Box marginY={3}>
        <Outlet />
      </Box>
    </Container>
  </React.Fragment>
);

export default Base;

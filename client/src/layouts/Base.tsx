import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container, { ContainerProps } from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

import ApplicationName from './ApplicationName';
import Search from './Search';
import UserMenu from './UserMenu';

interface BaseProps {
  containerWidth?: ContainerProps['maxWidth'];
}

const Base: React.FC<BaseProps> = ({ containerWidth = 'lg' }) => (
  <React.Fragment>
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box display="flex">
            <ApplicationName />
          </Box>
          <Box display="flex" flexGrow={1} marginX={8}>
            <Search />
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

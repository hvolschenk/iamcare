import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container, { ContainerProps } from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { useSearch } from '~/src/providers/Search';

import ApplicationName from './ApplicationName';
import UserMenu from './UserMenu';

interface BaseProps {
  containerWidth?: ContainerProps['maxWidth'];
}

const Base: React.FC<BaseProps> = ({ containerWidth = 'lg' }) => {
  const { searchDialogOpen } = useSearch();

  return (
    <Box sx={{ paddingBottom: { md: 0, xs: 7 } }}>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box display="flex" flexGrow={1}>
              <ApplicationName />
            </Box>
            <Box sx={{ display: { md: 'block', xs: 'none' } }}>
              <Stack direction="row" spacing={2}>
                <IconButton
                  data-testid="search__open-dialog"
                  onClick={searchDialogOpen}
                >
                  <SearchIcon />
                </IconButton>
                <UserMenu />
              </Stack>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth={containerWidth}>
        <Toolbar />
        <Box marginY={3}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default Base;

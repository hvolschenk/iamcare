import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container, { ContainerProps } from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from 'react-router-dom';

import configuration from '~/src/configuration';
import { useCookies } from '~/src/providers/Cookies';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useSearch } from '~/src/providers/Search';

import ApplicationName from './ApplicationName';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import UserMenu from './UserMenu';

interface BaseProps {
  containerWidth?: ContainerProps['maxWidth'];
}

const Base: React.FC<BaseProps> = ({ containerWidth = 'lg' }) => {
  const { areCookiesAccepted } = useCookies();
  const { initialize, set, trackPageView } = useGoogleAnalytics();
  const location = useLocation();
  const navigation = useNavigation();
  const { searchDialogOpen } = useSearch();

  React.useEffect(() => {
    const analyticsDisableKey: string = `ga-disable-${configuration.google.analytics.measurementID()}`;
    if (areCookiesAccepted) {
      // @ts-ignore
      window[analyticsDisableKey] = false;
      initialize();
    } else {
      // @ts-ignore
      window[analyticsDisableKey] = true;
    }
  }, [areCookiesAccepted, initialize]);

  React.useEffect(() => {
    const page = `${location.pathname}${location.search}`;
    set({ page });
    trackPageView({ page });
  }, [location, set, trackPageView]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        paddingBottom: 7,
        position: 'relative',
      }}
    >
      <ScrollRestoration />
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
          {navigation.state === 'loading' && (
            <React.Fragment>
              <Skeleton data-testid="base-layout__loading" />
              <Skeleton data-testid="base-layout__loading" />
              <Skeleton data-testid="base-layout__loading" />
            </React.Fragment>
          )}
          {navigation.state !== 'loading' && <Outlet />}
        </Box>
      </Container>

      <Footer />
      <MobileMenu />
    </Box>
  );
};

export default Base;

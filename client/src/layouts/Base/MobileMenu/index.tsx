import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';
import { root } from '~/src/urls';

import Threads from './Threads';
import User from './User';

const MobileMenu: React.FC = () => {
  const { searchDialogOpen } = useSearch();

  return (
    <Paper
      elevation={3}
      sx={{ bottom: 0, left: 0, position: 'fixed', right: 0 }}
    >
      <BottomNavigation sx={{ display: { md: 'none', xs: 'flex' } }}>
        <BottomNavigationAction
          component={Link}
          icon={<HomeIcon />}
          label={l10n.home}
          showLabel
          to={root()}
        />
        <BottomNavigationAction
          icon={<SearchIcon />}
          label={l10n.search}
          onClick={searchDialogOpen}
          showLabel
        />
        <Threads />
        <User />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileMenu;

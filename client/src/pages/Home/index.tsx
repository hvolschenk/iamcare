import Box from '@mui/material/Box';
import React from 'react';

import Banner from './Banner';
import Help from './Help';
import Latest from './Latest';
import Locations from './Locations';
import Tags from './Tags';

const Home: React.FC = () => (
  <React.Fragment>
    <Banner />
    <Box marginTop={4}>
      <Latest />
    </Box>
    <Box marginTop={4}>
      <Locations />
    </Box>
    <Box marginTop={6}>
      <Help />
    </Box>
    <Box marginTop={6}>
      <Tags />
    </Box>
  </React.Fragment>
);

export default Home;

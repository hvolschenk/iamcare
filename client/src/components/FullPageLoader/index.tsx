import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import React from 'react';

import logo192x192 from '~/public/images/icons/android-chrome-192x192.png';
import l10n from '~/src/l10n';

const pulse = keyframes`
  from { opacity: 1; }
  50% { opacity: 0.8; }
  to { opacity: 1; }
`;

const FullPageLoader: React.FC = () => (
  <Box
    alignItems="center"
    display="flex"
    flexDirection="column"
    height="100vh"
    justifyContent="center"
    sx={{ animation: `${pulse} 2s infinite ease` }}
    width="100vw"
  >
    <img alt={l10n.applicationName} src={logo192x192} />
  </Box>
);

export default FullPageLoader;

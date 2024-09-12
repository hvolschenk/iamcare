import CssBaseline from '@mui/material/CssBaseline';
import { brown, pink } from '@mui/material/colors';
import {
  ThemeProvider as MUIThemeProvider,
  alpha,
  createTheme,
} from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: { main: brown[400] },
        secondary: { main: pink[200] },
      },
    },
    light: {
      palette: {
        background: {
          default: alpha(brown[400], 0.05),
        },
        primary: { main: brown[400] },
        secondary: { main: pink[200] },
      },
    },
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <MUIThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
);

export default ThemeProvider;

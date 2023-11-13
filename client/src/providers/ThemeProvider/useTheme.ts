import { brown, pink } from '@mui/material/colors';
import { ThemeOptions, alpha, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const themeDark: ThemeOptions = {
    palette: {
      mode: 'dark',
      primary: { main: brown[400] },
      secondary: { main: pink[200] },
    },
  };
  const themeLight: ThemeOptions = {
    palette: {
      background: {
        default: alpha(brown[400], 0.05),
      },
      mode: 'light',
      primary: { main: brown[400] },
      secondary: { main: pink[200] },
    },
  };

  return createTheme(prefersDarkMode ? themeDark : themeLight);
};

export default useTheme;

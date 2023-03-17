import { brown, pink } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: { main: brown[400] },
      secondary: { main: pink[200] },
    },
  });
};

export default useTheme;

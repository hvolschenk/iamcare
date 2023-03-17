import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import useTheme from './useTheme';

jest.mock('@mui/material/styles', () => ({ createTheme: jest.fn() }));
jest.mock('@mui/material/useMediaQuery');

beforeEach(() => {
  (createTheme as jest.Mock).mockClear();
});

describe('When the user prefers dark mode', () => {
  beforeEach(() => {
    (useMediaQuery as jest.Mock).mockClear().mockReturnValue(true);
    useTheme();
  });

  test('Sets up the theme with dark mode support', () => {
    expect(createTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        palette: expect.objectContaining({ mode: 'dark' }),
      }),
    );
  });
});

describe('When the user does not prefer dark mode', () => {
  beforeEach(() => {
    (useMediaQuery as jest.Mock).mockClear().mockReturnValue(false);
    useTheme();
  });

  test('Sets up the theme with light mode support', () => {
    expect(createTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        palette: expect.objectContaining({ mode: 'light' }),
      }),
    );
  });
});

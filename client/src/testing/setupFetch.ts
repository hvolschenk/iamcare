global.Request = jest.fn().mockImplementation((url) => ({
  signal: {
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  url,
}));

global.scrollTo = jest.fn();

import '@testing-library/jest-dom/extend-expect';

global.URL.createObjectURL = jest
  .fn()
  .mockImplementation((file: File) => file.name);

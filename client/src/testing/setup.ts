import '@testing-library/jest-dom';

global.URL.createObjectURL = jest
  .fn()
  .mockImplementation((file: File) => file.name);

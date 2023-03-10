describe('Adds the correlation ID request interceptor', () => {
  const CONFIG = { headers: {} };
  const mockUse = jest.fn();
  const mockCreate = jest.fn().mockReturnValue({
    interceptors: { request: { use: mockUse }, response: { use: () => {} } },
  });

  let result: object;

  beforeAll(() => {
    jest.mock('axios', () => ({ create: mockCreate }));
    jest.resetModules();
    // eslint-disable-next-line global-require
    require('./client');
    result = mockUse.mock.calls[0][0](CONFIG);
  });

  test('Adds the ID to the config', () => {
    expect(result).toMatchObject({
      headers: { 'X-Request-ID': expect.any(String) },
    });
  });
});

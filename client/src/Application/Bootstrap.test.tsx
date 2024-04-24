import React from 'react';

import configuration from '~/src/configuration';
import { useCookies } from '~/src/providers/Cookies';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { render } from '~/src/testing';

import Bootstrap from './Bootstrap';

jest.mock('~/src/providers/Cookies');

const analyticsDisableKey: string = `ga-disable-${configuration.google.analytics.measurementID()}`;
const { initialize } = useGoogleAnalytics();

describe('When cookies have not been accepted', () => {
  beforeEach(() => {
    (initialize as jest.Mock).mockClear();
    (useCookies as jest.Mock)
      .mockClear()
      .mockReturnValue({ areCookiesAccepted: false });
    render(
      <Bootstrap>
        <div data-testid="children" />
      </Bootstrap>,
    );
  });

  test('Does not initialize Google Analytics', () => {
    expect(initialize).toHaveBeenCalledTimes(0);
  });

  test('Sets the global disable variable', () => {
    // @ts-ignore
    expect(global[analyticsDisableKey]).toBe(true);
  });
});

describe('When cookies have been accepted', () => {
  beforeEach(() => {
    (initialize as jest.Mock).mockClear();
    (useCookies as jest.Mock)
      .mockClear()
      .mockReturnValue({ areCookiesAccepted: true });
    render(
      <Bootstrap>
        <div data-testid="children" />
      </Bootstrap>,
    );
  });

  test('Initializes Google Analytics', () => {
    expect(initialize).toHaveBeenCalledTimes(1);
  });

  test('Sets the global disable variable', () => {
    // @ts-ignore
    expect(global[analyticsDisableKey]).toBe(false);
  });
});

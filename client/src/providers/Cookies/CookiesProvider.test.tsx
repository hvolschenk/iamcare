import React from 'react';

import { type RenderResult, fireEvent, render } from '~/src/testing';

import { Provider, useCookies } from './index';

const TestComponent: React.FC = () => {
  const { areCookiesAccepted } = useCookies();
  return (
    <div data-testid="are-cookies-accepted">
      {areCookiesAccepted ? 'YES' : 'NO'}
    </div>
  );
};

beforeEach(() => {
  process.env.HAS_COOKIES_BANNER = 'true';
});

describe('When the application does not need a cookies banner', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    process.env.HAS_COOKIES_BANNER = 'false';
    wrapper = render(
      <Provider>
        <TestComponent />
      </Provider>,
    );
  });

  test('Does not render the cookies dialog', () => {
    expect(
      wrapper.queryByTestId('cookies__action--accept'),
    ).not.toBeInTheDocument();
  });
});

describe('Without a stored initial value', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    localStorage.removeItem('COOKIES_ACCEPTED');
    wrapper = render(
      <Provider>
        <TestComponent />
      </Provider>,
    );
  });

  test('Renders the cookies dialog', () => {
    expect(wrapper.queryByTestId('cookies__action--accept')).toBeVisible();
  });

  describe('When declining cookies', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('cookies__action--decline'));
    });

    test('Hides the dialog', () => {
      expect(
        wrapper.queryByTestId('cookies__action--accept'),
      ).not.toBeVisible();
    });

    test('Sets the correct provider value', () => {
      expect(wrapper.queryByTestId('are-cookies-accepted')).toHaveTextContent(
        'NO',
      );
    });
  });

  describe('When accepting cookies', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('cookies__action--accept'));
    });

    test('Hides the dialog', () => {
      expect(
        wrapper.queryByTestId('cookies__action--accept'),
      ).not.toBeVisible();
    });

    test('Sets the correct provider value', () => {
      expect(wrapper.queryByTestId('are-cookies-accepted')).toHaveTextContent(
        'YES',
      );
    });
  });
});

describe.each([
  ['false', 'NO'],
  ['true', 'YES'],
])('With a stored cookie value of %s', (storedValue, displayText) => {
  let wrapper: RenderResult;

  beforeEach(() => {
    localStorage.setItem('COOKIES_ACCEPTED', storedValue);
    wrapper = render(
      <Provider>
        <TestComponent />
      </Provider>,
    );
  });

  test('Does not render the cookies dialog', () => {
    expect(
      wrapper.queryByTestId('cookies__action--accept'),
    ).not.toBeInTheDocument();
  });

  test('Sets the correct provider value', () => {
    expect(wrapper.queryByTestId('are-cookies-accepted')).toHaveTextContent(
      displayText,
    );
  });
});

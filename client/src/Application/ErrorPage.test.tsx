import React from 'react';

import { fireEvent, RenderResult, renderRouter } from '~/src/testing';
import { root } from '~/src/urls';

import ErrorPage from './ErrorPage';

let wrapper: RenderResult;

beforeEach(() => {
  wrapper = renderRouter(
    [
      { element: <div data-testid="root" />, path: root() },
      { Component: ErrorPage, path: '/error' },
    ],
    ['/error'],
  );
});

describe('Clicking on the primary action', () => {
  beforeEach(() => {
    fireEvent.click(wrapper.getByTestId('error__action--primary'));
  });

  test('Goes back to the home page', () => {
    expect(wrapper.queryByTestId('root')).toBeInTheDocument();
  });
});

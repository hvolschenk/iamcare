import { faker } from '@faker-js/faker';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { fireEvent, render, RenderResult } from '~/src/testing';
import { authentication, itemsSearch, root, user } from '~/src/urls';

import Base from './index';

describe('Without a logged-in user', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <Routes>
        <Route element={<Base containerWidth="lg" />} path={root()}>
          <Route element={<div data-testid="root" />} index />
          <Route
            element={<div data-testid="authentication" />}
            path={authentication()}
          />
        </Route>
      </Routes>,
      { router: { initialEntries: [root()] }, user: null },
    );
  });

  test('Renders an authentication link', () => {
    expect(
      wrapper.queryByTestId('authentication__user-menu__login'),
    ).toBeInTheDocument();
  });

  describe('Clicking on the authentication link', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('authentication__user-menu__login'));
    });

    test('Redirects to the authentication page', () => {
      expect(wrapper.queryByTestId('authentication')).toBeInTheDocument();
    });
  });
});

describe('With a logged-in user', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <Routes>
        <Route element={<Base />} path={root()}>
          <Route element={<div data-testid="root" />} index />
          <Route element={<div data-testid="search" />} path={itemsSearch()} />
          <Route element={<div data-testid="user" />} path={user()} />
        </Route>
      </Routes>,
      { router: { initialEntries: [root()] } },
    );
  });

  test('Renders the user avatar', () => {
    expect(
      wrapper.queryByTestId('authentication__user-menu__avatar'),
    ).toBeInTheDocument();
  });

  describe('Clicking the user avatar', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('authentication__user-menu__avatar'));
    });

    test('Redirects to the user profile page', () => {
      expect(wrapper.queryByTestId('user')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    beforeEach(() => {
      fireEvent.change(wrapper.getByTestId('search__input'), {
        target: { value: faker.word.sample() },
      });
    });

    describe('Clearing search', () => {
      beforeEach(() => {
        fireEvent.click(wrapper.getByTestId('search__action--clear'));
      });

      test('Clears the search field', () => {
        expect(wrapper.queryByTestId('search__input')).toHaveValue('');
      });
    });

    describe('Searching', () => {
      describe('By clicking', () => {
        beforeEach(() => {
          fireEvent.click(wrapper.getByTestId('search__action--search'));
        });

        test('Redirects to the search page', () => {
          expect(wrapper.queryByTestId('search')).toBeInTheDocument();
        });
      });

      describe('By pressing enter', () => {
        beforeEach(() => {
          fireEvent.keyDown(wrapper.getByTestId('search__input'), {
            key: 'Enter',
          });
        });

        test('Redirects to the search page', () => {
          expect(wrapper.queryByTestId('search')).toBeInTheDocument();
        });
      });
    });
  });
});

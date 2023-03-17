import React from 'react';

import { render, RenderResult } from '~/src/testing';

import PageTitle from './index';

describe('With minimal information', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<PageTitle title="Care, love and peace" />);
  });

  test('Does not render the breadcrumbs', () => {
    expect(
      wrapper.queryByTestId('page-title__breadcrumbs'),
    ).not.toBeInTheDocument();
  });

  test('Does not render the actions', () => {
    expect(
      wrapper.queryByTestId('page-title__actions'),
    ).not.toBeInTheDocument();
  });

  test('Renders the title', () => {
    expect(wrapper.getByTestId('page-title__title')).toHaveTextContent(
      'Care, love and peace',
    );
  });
});

describe('With all information', () => {
  const Actions: React.FC = () => <div data-testid="custom-actions" />;

  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <PageTitle
        actions={<Actions />}
        breadcrumbs={[
          { title: 'Care', url: '/care' },
          { title: 'Love', url: '/love' },
          { title: 'Peace' },
        ]}
        title="Care, love and peace"
      />,
    );
  });

  test('Renders the actions', () => {
    expect(wrapper.queryByTestId('custom-actions')).toBeInTheDocument();
  });

  describe('Renders the breadcrumbs with a URL', () => {
    test('Adds the proper URL', () => {
      expect(
        wrapper.getAllByTestId('page-title__breadcrumbs__breadcrumb')[0],
      ).toHaveAttribute('href', '/care');
    });

    test('Renders the proper title', () => {
      expect(
        wrapper.getAllByTestId('page-title__breadcrumbs__breadcrumb')[0],
      ).toHaveTextContent('Care');
    });
  });

  test('Renders the breadcrumb without a URL', () => {
    expect(
      wrapper.getAllByTestId('page-title__breadcrumbs__breadcrumb')[2],
    ).toHaveTextContent('Peace');
  });
});

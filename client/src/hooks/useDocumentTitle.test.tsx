import React from 'react';

import l10n from '~/src/l10n';
import { render } from '~/src/testing';

import useDocumentTitle from './useDocumentTitle';

const SampleComponent: React.FC = () => {
  useDocumentTitle(['Care']);

  return <div />;
};

beforeEach(() => {
  render(<SampleComponent />);
});

test('Sets the document title', () => {
  expect(document.title).toBe(`Care | ${l10n.applicationName}`);
});

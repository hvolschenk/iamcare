import React from 'react';
import { useSearchParams } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { root } from '~/src/urls';

import { Provider } from './context';
import SearchPage from './Search';

const Search: React.FC = () => {
  const [urlSearchParams] = useSearchParams();

  const distance = urlSearchParams.get('distance') || undefined;
  const location = urlSearchParams.get('location') || undefined;
  const query = urlSearchParams.get('query') || undefined;

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: l10n.search },
        ]}
        title={l10n.search}
      />
      <Provider filters={{ distance, location, query }}>
        <SearchPage />
      </Provider>
    </React.Fragment>
  );
};

export default Search;

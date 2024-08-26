import type { LoaderFunction } from 'react-router-dom';

import itemsSearch from '~/src/api/items/search';
import { queryClient } from '~/src/providers/QueryClient/Provider';
import { searchOptionsFromSearchParams } from '~/src/providers/Search/Provider';

const loader: LoaderFunction = async ({ request }) => {
  const urlSearchParams = new URL(request.url, window.location.origin)
    .searchParams;
  const searchOptions = searchOptionsFromSearchParams(urlSearchParams, 1);

  const { data } = await queryClient.fetchQuery({
    queryFn: () =>
      itemsSearch({
        distance: searchOptions.filters.distance || 0,
        googlePlaceID: searchOptions.filters.googlePlaceID,
        page: searchOptions.page,
        query: searchOptions.query,
        tagIDs: searchOptions.filters.tagIDs.map((tagID) => tagID.toString()),
      }),
    queryKey: ['items', 'search', searchOptions],
  });
  return data;
};

export default loader;

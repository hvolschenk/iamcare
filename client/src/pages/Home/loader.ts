import { LoaderFunction } from 'react-router-dom';

import itemsSearch from '~/src/api/items/search';
import locationsPopular from '~/src/api/locations/popular';
import tagsPopular from '~/src/api/tag/popular';
import { queryClient } from '~/src/providers/QueryClient/Provider';

const loader: LoaderFunction = async () => {
  const queryItems = queryClient.fetchQuery({
    queryFn: () =>
      itemsSearch({
        orderBy: 'latest',
        page: 1,
      }),
    queryKey: ['items', 'search', { orderBy: 'latest', page: 1 }],
  });
  const queryLocations = queryClient.fetchQuery({
    queryFn: locationsPopular,
    queryKey: ['locations', 'popular'],
  });
  const queryTags = queryClient.fetchQuery({
    queryFn: tagsPopular,
    queryKey: ['tags', 'popular'],
  });
  const [{ data: itemsLatest }, { data: locations }, { data: tags }] =
    await Promise.all([queryItems, queryLocations, queryTags]);
  return { items: itemsLatest, locations, tags };
};

export default loader;

import { LoaderFunction } from 'react-router-dom';

import itemGet from '~/src/api/items/get';
import { queryClient } from '~/src/providers/QueryClient/Provider';
import { ItemParams } from '~/src/urls';

const loader: LoaderFunction = async ({ params }) => {
  const itemID = parseInt((params as ItemParams).itemID, 10);
  const { data } = await queryClient.fetchQuery({
    queryFn: () => itemGet({ id: itemID }),
    queryKey: ['items', itemID],
  });
  return data;
};

export default loader;

import type { LoaderFunction } from 'react-router-dom';

import getUserItems from '~/src/api/user/getItems';
import { queryClient } from '~/src/providers/QueryClient/Provider';
import type { UserParams } from '~/src/urls';

const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url, window.location.origin);
  const searchPage = url.searchParams.get('page');
  const page: number = searchPage ? Number.parseInt(searchPage, 10) : 1;
  const userID = Number.parseInt((params as UserParams).userID, 10);
  const { data } = await queryClient.fetchQuery({
    queryFn: () => getUserItems(userID, page),
    queryKey: ['users', userID, 'items', { page }],
  });
  return data;
};

export default loader;

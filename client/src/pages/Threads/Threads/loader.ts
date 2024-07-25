import { LoaderFunction } from 'react-router-dom';

import threads from '~/src/api/threads/all';
import { queryClient } from '~/src/providers/QueryClient/Provider';

const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url, window.location.origin);
  const searchPage = url.searchParams.get('page');
  const page: number = searchPage ? parseInt(searchPage, 10) : 1;
  const { data } = await queryClient.fetchQuery({
    queryFn: () => threads(page),
    queryKey: ['threads', { page }],
  });
  return data;
};

export default loader;

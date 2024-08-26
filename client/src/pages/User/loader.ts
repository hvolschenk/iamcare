import type { LoaderFunction } from 'react-router-dom';

import user from '~/src/api/user/get';
import { queryClient } from '~/src/providers/QueryClient/Provider';
import type { UserParams } from '~/src/urls';

const loader: LoaderFunction = async ({ params }) => {
  const userID = Number.parseInt((params as UserParams).userID, 10);
  const { data } = await queryClient.fetchQuery({
    queryFn: () => user(userID),
    queryKey: ['users', userID],
  });
  return data;
};

export default loader;

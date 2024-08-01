import { LoaderFunction } from 'react-router-dom';

import threadGet from '~/src/api/threads/get';
import { queryClient } from '~/src/providers/QueryClient/Provider';
import { ThreadParams } from '~/src/urls';

const loader: LoaderFunction = async ({ params }) => {
  const threadID = parseInt((params as ThreadParams).threadID, 10);
  const { data } = await queryClient.fetchQuery({
    queryFn: () => threadGet({ id: threadID }),
    queryKey: ['threads', threadID],
  });
  return data;
};

export default loader;

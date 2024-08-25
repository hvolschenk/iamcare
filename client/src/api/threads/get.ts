import type { Thread } from '~/src/types/Thread';

import apiClient from '../client';

type ThreadGetOptions = Pick<Thread, 'id'>;

const threadGet = (options: ThreadGetOptions) =>
  apiClient.get<Thread>(`/threads/${options.id}`);

export default threadGet;

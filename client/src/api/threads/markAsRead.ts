import { Thread } from '~/src/types/Thread';

import apiClient from '../client';

type ThreadMarkAsReadOptions = Pick<Thread, 'id'>;

const threadMarkAsRead = (options: ThreadMarkAsReadOptions) =>
  apiClient.post(`/threads/${options.id}/mark-as-read`);

export default threadMarkAsRead;

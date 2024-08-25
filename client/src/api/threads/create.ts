import type { Message, Thread } from '~/src/types/Thread';

import apiClient from '../client';

interface ThreadCreateValues {
  item: Thread['item']['id'];
  message: Message['message'];
}

const threadCreate = (values: ThreadCreateValues) =>
  apiClient.post<Thread>('/threads', values);

export default threadCreate;

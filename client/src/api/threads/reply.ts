import type { Message, Thread } from '~/src/types/Thread';

import apiClient from '../client';

interface ThreadReplyValues {
  message: Message['message'];
}

const threadReply = (threadID: Thread['id'], values: ThreadReplyValues) =>
  apiClient.post<Thread>(`/threads/${threadID}/reply`, values);

export default threadReply;

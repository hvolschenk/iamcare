import apiClient from '../client';

const unreadCount = () =>
  apiClient.get<{ unreadThreads: number }>('/threads/unread');

export default unreadCount;

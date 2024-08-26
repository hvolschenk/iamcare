import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Thread } from '~/src/types/Thread';

import apiClient from '../client';

const threads = (page = 1) =>
  apiClient.get<APICollectionPaginated<Thread>>(`/threads?page=${page}`);

export default threads;

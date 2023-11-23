import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Thread } from '~/src/types/Thread';

import apiClient from '../client';

const threads = (page: number = 1) =>
  apiClient.get<APICollectionPaginated<Thread>>(`/threads?page=${page}`);

export default threads;

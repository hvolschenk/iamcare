import type { APICollection } from '~/src/types/APICollection';
import type { Tag } from '~/src/types/Tag';

import apiClient from '../client';

const tags = () => apiClient.get<APICollection<Tag>>('/tags');

export default tags;

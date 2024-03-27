import { APICollection } from '~/src/types/APICollection';
import { Tag } from '~/src/types/Tag';

import apiClient from '../client';

const tagsPopular = () => apiClient.get<APICollection<Tag>>('/tags/popular');

export default tagsPopular;

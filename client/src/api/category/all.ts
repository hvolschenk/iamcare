import { APICollection } from '~/src/types/APICollection';
import { Category } from '~/src/types/Category';

import apiClient from '../client';

const categories = () => apiClient.get<APICollection<Category>>('/categories');

export default categories;

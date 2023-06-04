import { Category } from '~/src/types/Category';

import apiClient from '../client';

const categories = () => apiClient.get<Category[]>('/categories');

export default categories;

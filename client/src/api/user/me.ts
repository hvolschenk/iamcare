import type { User } from '~/src/types/User';

import apiClient from '../client';

const me = () => apiClient.get<User | undefined>('/users/me');

export default me;

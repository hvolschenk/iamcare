import { User } from '~/src/types/User';

import apiClient from '../client';

const me = () => apiClient.get<User | void>('/users/me');

export default me;

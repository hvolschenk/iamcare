import { User } from '~/src/types/User';

import apiClient from '../client';

const me = () => apiClient.get<User | void>('/authenticate/me');

export default me;

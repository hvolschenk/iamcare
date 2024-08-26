import type { User } from '~/src/types/User';

import client from '../client';

const getUser = (userID: User['id']) => client.get<User>(`/users/${userID}`);

export default getUser;

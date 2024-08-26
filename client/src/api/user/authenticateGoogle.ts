import type { AxiosResponse } from 'axios';

import type { User } from '~/src/types/User';

import apiClient from '../client';

interface Payload {
  accessToken: string;
}

const authenticateGoogle = (accessToken: string) =>
  apiClient.post<User, AxiosResponse<User>, Payload>(
    '/users/authenticate/google',
    {
      accessToken,
    },
  );

export default authenticateGoogle;

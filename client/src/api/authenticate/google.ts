import { AxiosResponse } from 'axios';

import { User } from '~/src/types/User';

import apiClient from '../client';

interface Payload {
  accessToken: string;
}

const authenticateGoogle = (accessToken: string) =>
  apiClient.post<User, AxiosResponse<User>, Payload>('/authenticate/google', {
    accessToken,
  });

export default authenticateGoogle;

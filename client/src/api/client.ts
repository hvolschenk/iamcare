import axios from 'axios';
import { v4 as uuid } from 'uuid';

import configuration from '../configuration';

const api = axios.create({
  baseURL: configuration.api.baseURL(),
  withCredentials: true,
  // This is theoretically considered unsafe.
  // See: https://github.com/axios/axios/issues/6006
  // In this case, however, the `baseURL` makes it impossible
  // for any requests to escape and send the `X-XSRF-Token` to bad actors.
  withXSRFToken: true,
});

api.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers['X-Request-ID'] = uuid();
  return config;
});

export default api;

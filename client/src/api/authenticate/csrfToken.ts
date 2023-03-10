import apiClient from '../client';

const csrfToken = () => apiClient.get<void>('/sanctum/csrf-cookie');

export default csrfToken;

import apiClient from '../client';

const logout = () => apiClient.post('/users/logout');

export default logout;

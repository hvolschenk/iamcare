export const authentication = () => '/authentication';
export const itemCreate = () => '/items/create';
export const items = () => '/items';
export const root = () => '/';
export const user = (userID = ':userID') => `/users/${userID}`;
export const userItems = (userID = ':userID') => `/users/${userID}/items`;

// -----------------------------------------------------------------------------
// Helper methods
// These are ONLY necessary because of the sillyness of `react-router@6`
// https://github.com/remix-run/react-router/issues/8035
// -----------------------------------------------------------------------------
export const urlLayout = (url: string): string => `${url}/*`;
export const urlRelative = (url: string, parent: string): string =>
  url.replace(parent, '');

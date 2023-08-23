export const authentication = () => '/authentication';

interface ItemsSearchOptions {
  distance?: number;
  location?: string;
  page?: number;
  perPage?: number;
  query?: string;
}
export const itemsSearch = (options: ItemsSearchOptions = {}) => {
  const searchParams = new URLSearchParams();
  if (options.distance) {
    searchParams.set('distance', options.distance.toString());
  }
  if (options.location) {
    searchParams.set('location', options.location);
  }
  if (options.page) {
    searchParams.set('page', options.page.toString());
  }
  if (options.perPage) {
    searchParams.set('perPage', options.perPage.toString());
  }
  if (options.query) {
    searchParams.set('query', options.query);
  }
  return `/items/search?${searchParams.toString()}`;
};

export const root = () => '/';

export type UserParams = { userID: string };
export const user = (userID = ':userID') => `/users/${userID}`;
export const userItems = (userID = ':userID') => `/users/${userID}/items`;
export const userItemsCreate = (userID = ':userID') =>
  `/users/${userID}/items/create`;

// -----------------------------------------------------------------------------
// Helper methods
// These are ONLY necessary because of the sillyness of `react-router@6`
// https://github.com/remix-run/react-router/issues/8035
// -----------------------------------------------------------------------------
export const urlLayout = (url: string): string => `${url}/*`;
export const urlRelative = (url: string, parent: string): string =>
  url.replace(parent, '');

import { Tag } from '~/src/types/Tag';

export const authentication = () => '/authentication';

export type ItemParams = { itemID: string };
export const item = (itemID = ':itemID') => `/items/${itemID}`;
export interface ItemsSearchOptions {
  distance?: number;
  location?: string;
  page?: number;
  perPage?: number;
  query?: string;
  tag?: Tag['id'][];
}
export const itemsSearch = (options: ItemsSearchOptions = {}) => {
  const searchParams = new URLSearchParams();
  if (options.distance) {
    searchParams.set('distance', options.distance.toString());
  }
  if (options.location) {
    searchParams.set('googlePlaceID', options.location);
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
  if (options.tag) {
    options.tag.forEach((tag) => {
      searchParams.append('tag', tag.toString());
    });
  }
  const stringParams = searchParams.toString();
  const queryString = stringParams ? `?${stringParams}` : '';
  return `/items/search${queryString}`;
};

export type ThreadParams = { threadID: string };
export const thread = (threadID = ':threadID') => `/threads/${threadID}`;
export type ThreadCreateParams = { itemID: string };
export const threadCreate = (itemID: string = ':itemID') =>
  `/threads/create/${itemID}`;
export const threads = () => '/threads';

export const root = () => '/';

export type UserParams = { userID: string };
export const user = (userID = ':userID') => `/users/${userID}`;
export const userItems = (userID = ':userID') => `/users/${userID}/items`;
export const userItemsCreate = (userID = ':userID') =>
  `/users/${userID}/items/create`;
export type UserItemParams = UserParams & {
  itemID: string;
};
export const userItemsItem = (userID = ':userID', itemID = ':itemID') =>
  `/users/${userID}/items/${itemID}`;

// -----------------------------------------------------------------------------
// Helper methods
// These are ONLY necessary because of the sillyness of `react-router@6`
// https://github.com/remix-run/react-router/issues/8035
// -----------------------------------------------------------------------------
export const urlLayout = (url: string): string => `${url}/*`;
export const urlRelative = (url: string, parent: string): string =>
  url.replace(parent, '');

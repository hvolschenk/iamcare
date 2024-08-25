import type { Tag } from '~/src/types/Tag';

interface AuthenticationOptions {
  redirectURI?: string;
}
export const authentication = (options: AuthenticationOptions) => {
  const searchParams = new URLSearchParams();
  if (options.redirectURI) {
    searchParams.set('redirectURI', options.redirectURI.toString());
  }
  const stringParams = searchParams.toString();
  const queryString = stringParams ? `?${stringParams}` : '';
  return `/authentication${queryString}`;
};

export const healthAndSafety = () => '/health-and-safety';

export type ItemParams = { itemID: string };
export const item = (itemID = ':itemID') => `/items/${itemID}`;
export const items = () => '/items';
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
export const threadCreate = (itemID = ':itemID') => `/threads/create/${itemID}`;
interface ThreadsOptions {
  page?: number;
}
export const threads = (options?: ThreadsOptions) => {
  const searchParams = new URLSearchParams();
  if (options?.page) {
    searchParams.set('page', options.page.toString());
  }
  const stringParams = searchParams.toString();
  const queryString = stringParams ? `?${stringParams}` : '';
  return `/threads${queryString}`;
};

export const root = () => '/';

export type UserParams = { userID: string };
export const user = (userID = ':userID') => `/users/${userID}`;
interface UserItemsOptions {
  page?: number;
}
export const userItems = (userID = ':userID', options?: UserItemsOptions) => {
  const searchParams = new URLSearchParams();
  if (options?.page) {
    searchParams.set('page', options.page.toString());
  }
  const stringParams = searchParams.toString();
  const queryString = stringParams ? `?${stringParams}` : '';
  return `/users/${userID}/items${queryString}`;
};
export const userItemsCreate = (userID = ':userID') =>
  `/users/${userID}/items/create`;
export type UserItemParams = UserParams & {
  itemID: string;
};
export const userItemsItem = (userID = ':userID', itemID = ':itemID') =>
  `/users/${userID}/items/${itemID}`;

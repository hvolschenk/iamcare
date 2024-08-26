import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Item } from '~/src/types/Item';
import type { User } from '~/src/types/User';

import client from '../client';

const getUserItems = (
  userID: User['id'],
  page: number = 1,
  perPage?: number,
) => {
  const parameters: Record<string, string> = {
    page: page.toString(),
    perPage: perPage ? perPage.toString() : '',
  };
  const urlParameters = new URLSearchParams(
    Object.entries(parameters).filter(([, value]) => Boolean(value)),
  );
  return client.get<APICollectionPaginated<Item>>(
    `/users/${userID}/items?${urlParameters.toString()}`,
  );
};

export default getUserItems;

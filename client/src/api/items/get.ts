import { Item } from '~/src/types/Item';

import apiClient from '../client';

type ItemGetOptions = Pick<Item, 'id'>;

const itemGet = (options: ItemGetOptions) =>
  apiClient.get<Item>(`/items/${options.id}`);

export default itemGet;

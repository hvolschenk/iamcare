import type { Item } from '~/src/types/Item';

import client from '../client';

const markItemAsGiven = (itemID: Item['id']) =>
  client.post<Item>(`/items/${itemID}/mark-as-given`);

export default markItemAsGiven;

import type { Item } from '~/src/types/Item';
import type { LocationBasic } from '~/src/types/LocationBasic';
import type { Tag } from '~/src/types/Tag';

import apiClient from '../client';

export interface ItemCreate {
  description: Item['description'];
  images: File[];
  location: Pick<LocationBasic, 'googlePlaceID'>;
  name: Item['name'];
  tags: Tag['id'][];
}

const itemCreate = (data: ItemCreate) => {
  const formData = new FormData();
  formData.append('description', data.description);
  data.images.forEach((image) => {
    formData.append('image[]', image);
  });
  formData.append('location', data.location.googlePlaceID);
  formData.append('name', data.name);
  data.tags.forEach((tag) => {
    formData.append('tag[]', tag.toString());
  });

  return apiClient.post<Item>('/items', formData);
};

export default itemCreate;

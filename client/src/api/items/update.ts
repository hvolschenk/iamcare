import { Image } from '~/src/types/Image';
import { Item } from '~/src/types/Item';
import { LocationBasic } from '~/src/types/LocationBasic';
import { Tag } from '~/src/types/Tag';

import apiClient from '../client';

export interface ItemUpdate {
  description: Item['description'];
  id: Item['id'];
  images: File[];
  location: Pick<LocationBasic, 'googlePlaceID'>;
  name: Item['name'];
  removeImages: Image['id'][];
  tags: Tag['id'][];
}

const itemUpdate = (data: ItemUpdate) => {
  const formData = new FormData();
  formData.append('description', data.description);
  formData.append('id', data.id.toString());
  data.images.forEach((image) => {
    formData.append('image[]', image);
  });
  formData.append('location', data.location.googlePlaceID);
  formData.append('name', data.name);
  data.removeImages.forEach((removeImage) => {
    formData.append('removeImage[]', removeImage.toString());
  });
  data.tags.forEach((tag) => {
    formData.append('tag[]', tag.toString());
  });
  // Okay just wow. I cannot use `PUT` like a normal person,
  // but instead I have to do this.
  // https://github.com/laravel/framework/issues/13457
  formData.append('_method', 'PUT');

  return apiClient.post<Item>(`/items/${data.id}`, formData);
};

export default itemUpdate;

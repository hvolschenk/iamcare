import { Item, ItemCreate } from '~/src/types/Item';

import apiClient from '../client';

type FormValues = ItemCreate;

const itemCreate = (data: FormValues) => {
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

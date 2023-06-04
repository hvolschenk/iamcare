import { ItemCreate } from '~/src/types/Item';

import itemCreate from './create';
import apiClient from '../client';

jest.mock('../client');

const formValues: ItemCreate = {
  category: 'Love',
  description: 'I am care',
  images: [new File(['<3'], 'care.png'), new File(['<3'], 'love.png')],
  location: { placeID: '22' },
  name: 'Care',
};
const formData = new FormData();
formData.append('category', formValues.category);
formData.append('description', formValues.description);
formValues.images.forEach((image) => {
  formData.append('image[]', image);
});
formData.append('location', formValues.location.placeID);
formData.append('name', formValues.name);

beforeEach(() => {
  (apiClient.post as jest.Mock).mockClear();
  itemCreate(formValues);
});

test('Posts the correct values', () => {
  expect(apiClient.post).toHaveBeenCalledWith('/items', formData);
});

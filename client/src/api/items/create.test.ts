import apiClient from '../client';
import itemCreate, { type ItemCreate } from './create';

jest.mock('../client');

const formValues: ItemCreate = {
  description: 'I am care',
  images: [new File(['<3'], 'care.png'), new File(['<3'], 'love.png')],
  location: { googlePlaceID: '22' },
  name: 'Care',
  tags: [22, 42],
};
const formData = new FormData();
formData.append('description', formValues.description);
formValues.images.forEach((image) => {
  formData.append('image[]', image);
});
formData.append('location', formValues.location.googlePlaceID);
formData.append('name', formValues.name);
formValues.tags.forEach((tag) => {
  formData.append('tag[]', tag.toString());
});

beforeEach(() => {
  (apiClient.post as jest.Mock).mockClear();
  itemCreate(formValues);
});

test('Posts the correct values', () => {
  expect(apiClient.post).toHaveBeenCalledWith('/items', formData);
});

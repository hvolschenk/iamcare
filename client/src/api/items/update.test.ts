import itemUpdate, { ItemUpdate } from './update';
import apiClient from '../client';

jest.mock('../client');

const formValues: ItemUpdate = {
  description: 'I am care',
  id: 22,
  images: [new File(['<3'], 'care.png'), new File(['<3'], 'love.png')],
  location: { googlePlaceID: '22' },
  name: 'Care',
  removeImages: [22],
  tags: [22, 42],
};
const formData = new FormData();
formData.append('description', formValues.description);
formData.append('id', formValues.id.toString());
formValues.images.forEach((image) => {
  formData.append('image[]', image);
});
formData.append('location', formValues.location.googlePlaceID);
formData.append('name', formValues.name);
formValues.removeImages.forEach((removeImage) => {
  formData.append('removeImage[]', removeImage.toString());
});
formValues.tags.forEach((tag) => {
  formData.append('tag[]', tag.toString());
});
formData.append('_method', 'PUT');

beforeEach(() => {
  (apiClient.post as jest.Mock).mockClear();
  itemUpdate(formValues);
});

test('PUTs the correct values', () => {
  expect(apiClient.post).toHaveBeenCalledWith(
    `/items/${formValues.id}`,
    formData,
  );
});

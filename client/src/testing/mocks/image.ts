import { faker } from '@faker-js/faker';

import type { Image } from '~/src/types/Image';

const image = (partialImage?: Partial<Image>): Image => ({
  id: faker.number.int(),
  mimeType: 'image/jpeg',
  name: faker.word.sample(),
  sizeBytes: faker.number.int(),
  url: faker.image.url(),
  ...partialImage,
});

export default image;

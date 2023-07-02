// This will only ever be used in tests,
// so importing `devDependencies` here is absolutely fine.
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

import { Item } from '~/src/types/Item';

import category from './category';
import image from './image';
import locationBasic from './locationBasic';
import user from './user';

const item = (partialItem?: Partial<Item>): Item => ({
  category: category(),
  description: faker.commerce.productDescription(),
  id: faker.number.int(),
  images: [image(), image()],
  location: locationBasic(),
  name: faker.commerce.productName(),
  user: user(),
  ...partialItem,
});

export default item;

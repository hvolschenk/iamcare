// This will only ever be used in tests,
// so importing `devDependencies` here is absolutely fine.
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

import { Category } from '~/src/types/Category';

const category = (partialCategory?: Partial<Category>): Category => ({
  id: faker.number.int(),
  name: faker.commerce.department(),
  ...partialCategory,
});

export default category;

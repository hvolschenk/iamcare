import { faker } from '@faker-js/faker';
import { UniqueEnforcer } from 'enforce-unique';

import type { Tag } from '~/src/types/Tag';

const titleUniqueEnforcer = new UniqueEnforcer();

const tag = (partialTag?: Partial<Tag>): Tag => ({
  id: faker.number.int(),
  title: titleUniqueEnforcer.enforce(() =>
    faker.helpers.arrayElement([
      'accessories',
      'appliances',
      'art',
      'beauty',
      'books',
      'camping',
      'collectibles',
      'decor',
      'diy',
      'electronics',
      'fashion',
      'fitness',
      'food',
      'gadgets',
      'gaming',
      'gifts',
      'handmade',
      'health',
      'hobbies',
      'jewelry',
      'kids',
      'kitchen',
      'learning',
      'movies',
      'music',
      'outdoor',
      'party',
      'pets',
      'photography',
      'plants',
      'smarthome',
      'sports',
      'stationery',
      'sustainable',
      'technology',
      'television',
      'travel',
      'vintage',
      'wellness',
    ]),
  ),
  ...partialTag,
});

export default tag;

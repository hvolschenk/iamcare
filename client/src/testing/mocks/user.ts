// This will only ever be used in tests,
// so importing `devDependencies` here is absolutely fine.
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

import { User } from '~/src/types/User';

const user = (partialUser?: Partial<User>): User => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    avatar: faker.image.avatar(),
    dateCreated: faker.date.past().toString(),
    dateUpdated: faker.date.past().toString(),
    email: faker.helpers.maybe(() =>
      faker.internet.email({ firstName, lastName }),
    ),
    id: faker.number.int(),
    name: faker.person.fullName({ firstName, lastName }),
    ...partialUser,
  };
};

export default user;

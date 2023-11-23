// This will only ever be used in tests,
// so importing `devDependencies` here is absolutely fine.
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

import { Message } from '~/src/types/Thread';

const message = (partialMessage?: Partial<Message>): Message => ({
  dateCreated: faker.date.past().toString(),
  id: faker.number.int(),
  message: faker.lorem.paragraph(),
  userID: faker.number.int(),
  ...partialMessage,
});

export default message;

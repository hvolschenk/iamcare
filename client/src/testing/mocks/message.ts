import { faker } from '@faker-js/faker';

import type { Message } from '~/src/types/Thread';

const message = (partialMessage?: Partial<Message>): Message => ({
  dateCreated: faker.date.past().toString(),
  id: faker.number.int(),
  message: faker.lorem.paragraph(),
  userID: faker.number.int(),
  ...partialMessage,
});

export default message;

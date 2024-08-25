import { faker } from '@faker-js/faker';

import type { Thread } from '~/src/types/Thread';

import item from './item';
import message from './message';
import user from './user';

const thread = (partialThread?: Partial<Thread>): Thread => {
  const userGiver = partialThread?.userGiver || user();
  const userReceiver = partialThread?.userReceiver || user();

  return {
    dateCreated: faker.date.past().toString(),
    hasUnreadMessages: faker.datatype.boolean(),
    id: faker.number.int(),
    item: item(partialThread?.item),
    messages: [
      message({
        userID: userReceiver.id,
      }),
      message({
        userID: userReceiver.id,
      }),
      message({
        userID: userGiver.id,
      }),
      message({
        userID: userGiver.id,
      }),
      message({
        userID: faker.helpers.arrayElement([userGiver.id, userReceiver.id]),
      }),
    ],
    userGiver,
    userReceiver,
    ...partialThread,
  };
};

export default thread;

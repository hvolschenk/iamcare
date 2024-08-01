import {
  authentication,
  item,
  items,
  itemsSearch,
  root,
  thread,
  threadCreate,
  threads,
  user,
  userItems,
  userItemsCreate,
  userItemsItem,
} from './urls';

type TestCase = [
  name: string,
  method: Function,
  parameters: any[],
  result: string,
];

test.each<TestCase>([
  ['authentication (no parameters)', authentication, [{}], '/authentication'],
  [
    'authentication',
    authentication,
    [{ redirectURI: 'redirectURI' }],
    '/authentication?redirectURI=redirectURI',
  ],
  ['item (no paramaters)', item, [], '/items/:itemID'],
  ['item', item, ['22'], '/items/22'],
  ['items', items, [], '/items'],
  ['itemsSearch (no paramaters)', itemsSearch, [], '/items/search'],
  [
    'itemsSearch',
    itemsSearch,
    [
      {
        distance: 22,
        location: 'Centurion',
        page: 5,
        perPage: 10,
        query: 'Television',
        tag: [2, 4, 6, 8],
      },
    ],
    '/items/search?distance=22&googlePlaceID=Centurion&page=5&perPage=10&query=Television&tag=2&tag=4&tag=6&tag=8',
  ],
  ['root', root, [], '/'],
  ['thread (no parameters)', thread, [], '/threads/:threadID'],
  ['thread', thread, ['22'], '/threads/22'],
  ['threadCreate (no parameters)', threadCreate, [], '/threads/create/:itemID'],
  ['threadCreate', threadCreate, ['22'], '/threads/create/22'],
  ['threads (no parameters)', threads, [], '/threads'],
  ['threads', threads, [{ page: 2 }], '/threads?page=2'],
  ['user (no paramaters)', user, [], '/users/:userID'],
  ['user', user, ['22'], '/users/22'],
  ['userItems (no paramaters)', userItems, [], '/users/:userID/items'],
  ['userItems', userItems, ['22'], '/users/22/items'],
  [
    'userItemsCreate (no paramaters)',
    userItemsCreate,
    [],
    '/users/:userID/items/create',
  ],
  ['userItemsCreate', userItemsCreate, ['22'], '/users/22/items/create'],
  [
    'userItemsItem (no parameters)',
    userItemsItem,
    [],
    '/users/:userID/items/:itemID',
  ],
  ['userItemsItem', userItemsItem, ['22', '33'], '/users/22/items/33'],
])('Renders the %s URL', (name, method, parameters, result) => {
  expect(method(...parameters)).toBe(result);
});

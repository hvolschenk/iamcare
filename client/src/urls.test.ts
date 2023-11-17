import {
  authentication,
  item,
  itemsSearch,
  root,
  user,
  userItems,
  userItemsCreate,
  urlLayout,
  urlRelative,
} from './urls';

type TestCase = [
  name: string,
  method: Function,
  parameters: any[],
  result: string,
];

test.each<TestCase>([
  ['authentication', authentication, [], '/authentication'],
  ['item (no paramaters)', item, [], '/items/:itemID'],
  ['item', item, ['22'], '/items/22'],
  ['itemsSearch (no paramaters)', itemsSearch, [], '/items/search?'],
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
      },
    ],
    '/items/search?distance=22&location=Centurion&page=5&perPage=10&query=Television',
  ],
  ['root', root, [], '/'],
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
  ['urlLayout', urlLayout, ['/one/two'], '/one/two/*'],
  ['urlRelative', urlRelative, ['/one/two', '/one'], '/two'],
])('Renders the %s URL', (name, method, parameters, result) => {
  expect(method(...parameters)).toBe(result);
});

import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';

const apiCollectionPaginated = <T>(
  partialAPICollectionPaginated: Partial<APICollectionPaginated<T>>,
): APICollectionPaginated<T> => ({
  data: partialAPICollectionPaginated.data || [],
  links: {
    first: 'first',
    last: 'last',
    next: 'next',
    prev: 'prev',
    ...partialAPICollectionPaginated.links,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: 'path',
    per_page: 3,
    to: partialAPICollectionPaginated.data?.length || 1,
    total: 1,
    ...partialAPICollectionPaginated.meta,
  },
});

export default apiCollectionPaginated;

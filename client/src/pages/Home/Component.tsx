import Box from '@mui/material/Box';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import type { APICollection } from '~/src/types/APICollection';
import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Item } from '~/src/types/Item';
import type { LocationBasic } from '~/src/types/LocationBasic';
import type { Tag } from '~/src/types/Tag';

import Banner from './Banner';
import Help from './Help';
import Latest from './Latest';
import Locations from './Locations';
import Tags from './Tags';

const Home: React.FC = () => {
  useDocumentTitle([l10n.homeSlogan]);
  const { items, locations, tags } = useLoaderData() as {
    items: APICollectionPaginated<Item>;
    locations: APICollection<LocationBasic>;
    tags: APICollection<Tag>;
  };

  return (
    <React.Fragment>
      <Banner />
      <Box marginTop={4}>
        <Latest items={items} />
      </Box>
      <Box marginTop={4}>
        <Locations locations={locations} />
      </Box>
      <Box marginTop={6}>
        <Help />
      </Box>
      <Box marginTop={6}>
        <Tags tags={tags} />
      </Box>
    </React.Fragment>
  );
};

export default Home;

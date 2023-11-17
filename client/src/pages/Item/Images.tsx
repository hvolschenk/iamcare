import ImageList from '@mui/material/ImageList';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import { Item } from '~/src/types/Item';

import Image from './Image';

interface ImagesProps {
  item: Item;
}

const Images: React.FC<ImagesProps> = ({ item }) => {
  const theme = useTheme();
  const isBreakpointLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up('md'));

  const columnCount = React.useMemo<number>(() => {
    if (isBreakpointLg) {
      return 6;
    }
    if (isBreakpointMd) {
      return 4;
    }
    return 2;
  }, [isBreakpointLg, isBreakpointMd]);

  return (
    <ImageList
      cols={columnCount}
      // Having to specify the gap like this is horrendous.
      // No direct theme support here.
      gap={parseInt(theme.spacing(1), 10)}
    >
      {item.images.map((image) => (
        <Image image={image} key={image.id} item={item} />
      ))}
    </ImageList>
  );
};

export default Images;

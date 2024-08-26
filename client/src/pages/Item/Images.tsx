import ImageList from '@mui/material/ImageList';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import LightboxDialog from '~/src/components/LightboxDialog';
import type { Item } from '~/src/types/Item';

import Image from './Image';

interface ImagesProps {
  item: Item;
}

const Images: React.FC<ImagesProps> = ({ item }) => {
  const [isLightboxDialogOpen, setIsLightboxDialogOpen] =
    React.useState<boolean>(false);
  const [lightboxDialogIndex, setLightboxDialogIndex] =
    React.useState<number>(0);

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

  const onLightboxDialogClose = React.useCallback(() => {
    setIsLightboxDialogOpen(false);
  }, []);

  const onLightboxDialogOpen = React.useCallback((index: number) => {
    setLightboxDialogIndex(index);
    setIsLightboxDialogOpen(true);
  }, []);

  return (
    <React.Fragment>
      <ImageList
        cols={columnCount}
        // Having to specify the gap like this is horrendous.
        // No direct theme support here.
        gap={Number.parseInt(theme.spacing(1), 10)}
      >
        {item.images.map((image, index) => (
          <Image
            image={image}
            key={image.id}
            item={item}
            onClick={() => onLightboxDialogOpen(index)}
          />
        ))}
      </ImageList>
      <LightboxDialog
        images={item.images}
        isOpen={isLightboxDialogOpen}
        onClose={onLightboxDialogClose}
        startIndex={lightboxDialogIndex}
      />
    </React.Fragment>
  );
};

export default Images;

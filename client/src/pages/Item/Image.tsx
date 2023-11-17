import Dialog from '@mui/material/Dialog';
import ImageListItem from '@mui/material/ImageListItem';
import React from 'react';

import { Image as ImageType } from '~/src/types/Image';
import { Item } from '~/src/types/Item';

interface ImageProps {
  image: ImageType;
  item: Item;
}

const Image: React.FC<ImageProps> = ({ image, item }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <React.Fragment>
      <ImageListItem onClick={onOpen}>
        <img alt={item.name} data-testid="item__image" src={image.url} />
      </ImageListItem>
      <Dialog onClose={onClose} open={isOpen}>
        <img
          alt={item.name}
          data-testid="item__image--large"
          src={image.url}
          style={{ maxHeight: '80vh' }}
        />
      </Dialog>
    </React.Fragment>
  );
};

export default Image;

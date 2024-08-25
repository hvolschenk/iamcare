import ImageListItem from '@mui/material/ImageListItem';
import React from 'react';

import type { Image as ImageType } from '~/src/types/Image';
import type { Item } from '~/src/types/Item';

interface ImageProps {
  image: ImageType;
  item: Item;
  onClick(): void;
}

const Image: React.FC<ImageProps> = ({ image, item, onClick }) => (
  <ImageListItem onClick={onClick} sx={{ cursor: 'pointer' }}>
    <img alt={item.name} data-testid="item__image" src={image.url} />
  </ImageListItem>
);

export default Image;

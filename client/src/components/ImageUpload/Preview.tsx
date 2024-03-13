import { useTheme } from '@mui/material/styles';
import React from 'react';

import { Image } from '~/src/types/Image';

interface PreviewProps {
  image: File | Image;
  isRemoved: boolean;
}

const Preview: React.FC<PreviewProps> = ({ image, isRemoved }) => {
  const theme = useTheme();

  return (
    <img
      alt={image.name}
      src={image instanceof File ? URL.createObjectURL(image) : image.url}
      style={{
        filter: isRemoved ? 'grayscale(100%)' : undefined,
        height: parseInt(theme.spacing(1), 10) * 20,
        objectFit: 'cover',
      }}
    />
  );
};

export default Preview;

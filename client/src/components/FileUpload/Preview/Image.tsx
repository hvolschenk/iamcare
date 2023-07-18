import { useTheme } from '@mui/material/styles';
import React from 'react';

import { PreviewRendererProps } from './types';

const Image: React.FC<PreviewRendererProps> = ({ file }) => {
  const theme = useTheme();

  return (
    <img
      alt={file.name}
      src={URL.createObjectURL(file)}
      style={{
        height: parseInt(theme.spacing(1), 10) * 20,
        objectFit: 'cover',
      }}
    />
  );
};

export default Image;

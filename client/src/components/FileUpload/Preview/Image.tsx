import React from 'react';

import { PreviewRendererProps } from './types';

const Image: React.FC<PreviewRendererProps> = ({ file }) => (
  <img alt={file.name} src={URL.createObjectURL(file)} />
);

export default Image;

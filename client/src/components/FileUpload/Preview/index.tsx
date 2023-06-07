import React from 'react';

import Image from './Image';
import { PreviewRendererProps } from './types';
import Unknown from './Unknown';

const renderers: Record<string, React.ComponentType<PreviewRendererProps>> = {
  'image/jpeg': Image,
  'image/png': Image,
  'image/webp': Image,
};

const Preview: React.FC<PreviewRendererProps> = ({ file }) => {
  const Renderer = React.useMemo<React.ComponentType<PreviewRendererProps>>(
    () => renderers[file.type] || Unknown,
    [file],
  );

  return <Renderer file={file} />;
};

export default Preview;

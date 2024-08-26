import CloseIcon from '@mui/icons-material/Close';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React from 'react';

import type { Image } from '~/src/types/Image';

import Preview from './Preview';

interface ImageUploadImageProps {
  file: File | Image;
  isRemoved: boolean;
  onImageRemove(): void;
  onImageRestore(): void;
}

const ImageUploadImage: React.FC<ImageUploadImageProps> = ({
  file,
  isRemoved,
  onImageRemove,
  onImageRestore,
}) => (
  <ImageListItem
    data-testid="file-upload__uploaded-item"
    sx={{ alignItems: 'center', justifyContent: 'center' }}
  >
    <Preview image={file} isRemoved={isRemoved} />
    <ImageListItemBar
      actionIcon={
        <React.Fragment>
          {isRemoved && (
            <IconButton
              data-testid="file-upload__uploaded-item__restore"
              onClick={onImageRestore}
            >
              <RestoreFromTrashIcon />
            </IconButton>
          )}
          {!isRemoved && (
            <IconButton
              data-testid="file-upload__uploaded-item__remove"
              onClick={onImageRemove}
            >
              <CloseIcon />
            </IconButton>
          )}
        </React.Fragment>
      }
      position="top"
      sx={{ backgroundColor: 'transparent' }}
    />
  </ImageListItem>
);

export default ImageUploadImage;

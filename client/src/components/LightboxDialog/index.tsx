import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import React from 'react';

import l10n from '~/src/l10n';
import type { Image } from '~/src/types/Image';

interface LightboxDialogProps extends Omit<DialogProps, 'open'> {
  images: Image[];
  isOpen: boolean;
  startIndex?: number;
}

const LightboxDialog: React.FC<LightboxDialogProps> = ({
  images,
  isOpen,
  startIndex = 0,
  ...rest
}) => {
  const [index, setIndex] = React.useState<number>(startIndex);

  const image = React.useMemo<Image>(() => images[index], [images, index]);

  React.useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const onClickNext = React.useCallback(() => {
    if (index + 1 < images.length) {
      setIndex((currentIndex) => currentIndex + 1);
    }
  }, [images, index]);

  const onClickPrevious = React.useCallback(() => {
    if (index > 0) {
      setIndex((currentIndex) => currentIndex - 1);
    }
  }, [index]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        event.preventDefault();
        if (event.key === 'ArrowLeft') {
          onClickPrevious();
        }
        if (event.key === 'ArrowRight') {
          onClickNext();
        }
      },
      [onClickNext, onClickPrevious],
    );

  return (
    <Dialog
      {...rest}
      data-testid="lightbox-dialog"
      onKeyDown={onKeyDown}
      open={isOpen}
    >
      <img
        alt={image.name}
        data-testid="lightbox-dialog__image"
        src={image.url}
      />
      <Button
        aria-label={l10n.lightboxDialogActionPrevious}
        data-testid="lightbox-dialog__action--previous"
        onClick={onClickPrevious}
        sx={{
          bottom: 0,
          left: 0,
          position: 'absolute',
          top: 0,
          width: '50%',
        }}
      />
      <Button
        aria-label={l10n.lightboxDialogActionNext}
        data-testid="lightbox-dialog__action--next"
        onClick={onClickNext}
        sx={{
          bottom: 0,
          left: '50%',
          position: 'absolute',
          top: 0,
          width: '50%',
        }}
      />
    </Dialog>
  );
};

export default LightboxDialog;

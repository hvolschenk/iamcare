import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React from 'react';

import configuration from '~/src/configuration';
import type { LocationBasic } from '~/src/types/LocationBasic';

interface LocationMapDialogProps {
  isOpen: boolean;
  location: LocationBasic;
  onClose(): void;
}

const LocationMapDialog: React.FC<LocationMapDialogProps> = ({
  isOpen,
  location,
  onClose,
}) => {
  const src = React.useMemo<string>(() => {
    const url = new URL('/maps/embed/v1/place', 'https://www.google.com');
    url.searchParams.set('key', configuration.google.places.apiKey());
    url.searchParams.set('q', `place_id:${location.googlePlaceID}`);
    url.searchParams.set('region', configuration.google.places.countryCode());
    return url.toString();
  }, [location]);

  return (
    <Dialog
      data-testid="location-map-dialog"
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={isOpen}
      PaperProps={{
        sx: { minHeight: '60vh' },
      }}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <iframe
          allowFullScreen
          data-testid="location-map-dialog__content"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
          style={{
            border: 0,
            bottom: 0,
            height: '100%',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
            width: '100%',
          }}
          title={location.id.toString()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LocationMapDialog;

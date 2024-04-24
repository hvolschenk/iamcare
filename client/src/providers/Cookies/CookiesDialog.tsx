import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

import l10n from '~/src/l10n';

interface CookiesDialogProps {
  isOpen: boolean;
  onAccept(): void;
  onDecline(): void;
}

const CookiesDialog: React.FC<CookiesDialogProps> = ({
  isOpen,
  onAccept,
  onDecline,
}) => (
  <Dialog open={isOpen}>
    <DialogTitle>{l10n.cookiesTitle}</DialogTitle>
    <DialogContent>{l10n.cookiesDescription}</DialogContent>
    <DialogActions>
      <Button
        color="primary"
        data-testid="cookies__action--decline"
        onClick={onDecline}
        variant="text"
      >
        {l10n.cookiesActionDecline}
      </Button>
      <Button
        color="primary"
        data-testid="cookies__action--accept"
        onClick={onAccept}
        variant="contained"
      >
        {l10n.cookiesActionAccept}
      </Button>
    </DialogActions>
  </Dialog>
);

export default CookiesDialog;

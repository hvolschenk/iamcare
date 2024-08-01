import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import markItemAsGiven from '~/src/api/items/markAsGiven';
import l10n from '~/src/l10n';
import { Item } from '~/src/types/Item';

interface ItemMarkAsGivenDialogProps {
  isOpen: boolean;
  item: Item;
  onClose(): void;
  onError(): void;
  onSuccess(item: Item): void;
}

const ItemMarkAsGivenDialog: React.FC<ItemMarkAsGivenDialogProps> = ({
  isOpen,
  item,
  onClose,
  onError,
  onSuccess,
}) => {
  const { mutate, status } = useMutation({
    mutationFn: () => markItemAsGiven(item.id),
    mutationKey: ['item', item.id, 'mark-as-given'],
    onError,
    onSuccess: (response) => {
      onSuccess(response.data);
    },
  });

  const onMarkAsGiven = React.useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle>{l10n.itemMarkAsGivenTitle}</DialogTitle>
      <DialogContent>
        {l10n.formatString(l10n.itemMarkAsGivenDescription, {
          itemName: item.name,
        })}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={status === 'pending'}
          onClick={onClose}
          variant="text"
        >
          {l10n.actionCancel}
        </Button>
        <Button
          color="primary"
          disabled={status === 'pending'}
          data-testid="item__mark-as-given"
          onClick={onMarkAsGiven}
          variant="contained"
        >
          {l10n.itemMarkAsGiven}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemMarkAsGivenDialog;

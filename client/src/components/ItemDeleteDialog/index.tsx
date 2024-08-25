import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import deleteItem from '~/src/api/items/delete';
import l10n from '~/src/l10n';
import type { Item } from '~/src/types/Item';

interface ItemDeleteDialogProps {
  isOpen: boolean;
  item: Item;
  onClose(): void;
  onError(): void;
  onSuccess(): void;
}

const ItemDeleteDialog: React.FC<ItemDeleteDialogProps> = ({
  isOpen,
  item,
  onClose,
  onError,
  onSuccess,
}) => {
  const { mutate, status } = useMutation({
    mutationFn: () => deleteItem(item.id.toString()),
    mutationKey: ['items', item.id, 'delete'],
    onError,
    onSuccess,
  });

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle>
        {l10n.formatString(l10n.itemDeleteTitle, { itemName: item.name })}
      </DialogTitle>
      <DialogContent>
        {l10n.formatString(l10n.itemDeleteConfirmation, {
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
          data-testid="item__delete"
          disabled={status === 'pending'}
          onClick={() => mutate()}
          variant="contained"
        >
          {l10n.itemDeleteAction}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDeleteDialog;

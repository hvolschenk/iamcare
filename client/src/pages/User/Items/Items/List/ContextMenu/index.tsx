import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ItemDeleteDialog from '~/src/components/ItemDeleteDialog';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useNotifications } from '~/src/providers/Notifications';
import { Item } from '~/src/types/Item';
import { userItems } from '~/src/urls';

interface ContextMenuProps {
  item: Item;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ item }) => {
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    React.useState<boolean>(false);

  const { user } = useAuthentication();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const queryClient = useQueryClient();

  const onClose = React.useCallback(() => {
    setAnchorElement(null);
  }, [setAnchorElement]);
  const onOpen = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElement(event.currentTarget);
    },
    [setAnchorElement],
  );

  const onDeleteDialogClose = React.useCallback(
    () => setIsDeleteDialogOpen(false),
    [setIsDeleteDialogOpen],
  );
  const onDeleteDialogOpen = React.useCallback(() => {
    onClose();
    setIsDeleteDialogOpen(true);
  }, [onClose, setIsDeleteDialogOpen]);
  const onDeleteError = React.useCallback(() => {
    notify({ message: l10n.itemDeleteErrorDeleting });
  }, [notify]);
  const onDeleteSuccess = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['users', user!.id, 'items'] });
    queryClient.invalidateQueries({ queryKey: ['items', item.id] });
    notify({ message: l10n.itemDeleteSuccess });
    onDeleteDialogClose();
    navigate(userItems(user!.id.toString()));
  }, [item, navigate, notify, onDeleteDialogClose, queryClient, user]);

  const isOpen = Boolean(anchorElement);

  return (
    <React.Fragment>
      <IconButton
        data-testid="user-items__item__context-menu"
        edge="end"
        onClick={onOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorElement} onClose={onClose} open={isOpen}>
        <MenuItem
          data-testid="user-items__item__delete-dialog"
          onClick={onDeleteDialogOpen}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={l10n.itemDeleteAction} />
        </MenuItem>
      </Menu>

      <ItemDeleteDialog
        isOpen={isDeleteDialogOpen}
        item={item}
        onClose={onDeleteDialogClose}
        onError={onDeleteError}
        onSuccess={onDeleteSuccess}
      />
    </React.Fragment>
  );
};

export default ContextMenu;

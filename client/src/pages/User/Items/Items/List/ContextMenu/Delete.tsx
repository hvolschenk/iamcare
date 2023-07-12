import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

import l10n from '~/src/l10n';

interface DeleteProps {
  onClick(): void;
}

const Delete: React.FC<DeleteProps> = ({ onClick }) => (
  <MenuItem data-testid="user-items__item__delete-dialog" onClick={onClick}>
    <ListItemIcon>
      <DeleteIcon />
    </ListItemIcon>
    <ListItemText primary={l10n.itemDeleteAction} />
  </MenuItem>
);

export default Delete;

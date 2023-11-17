import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

import l10n from '~/src/l10n';

const ContextMenu: React.FC = () => {
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null,
  );

  const onClose = React.useCallback(
    () => setAnchorElement(null),
    [setAnchorElement],
  );
  const onOpen: React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (event) => {
      setAnchorElement(event.currentTarget);
    },
    [setAnchorElement],
  );

  return (
    <React.Fragment>
      <IconButton data-testid="item__context-menu" onClick={onOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        onClose={onClose}
        open={Boolean(anchorElement)}
      >
        <MenuItem data-testid="item__action--contact-giver">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary={l10n.itemContactGiver} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default ContextMenu;

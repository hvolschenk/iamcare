import DoneIcon from '@mui/icons-material/Done';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import ItemMarkAsGivenDialog from '~/src/components/ItemMarkAsGivenDialog';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useNotifications } from '~/src/providers/Notifications';

import { useThread } from './context';

const MarkAsGiven: React.FC = () => {
  const [isMarkAsGivenDialogOpen, setIsMarkAsGivenDialogOpen] =
    React.useState<boolean>(false);

  const { user } = useAuthentication();
  const { notify } = useNotifications();
  const queryClient = useQueryClient();
  const { thread } = useThread();

  const onClose = React.useCallback(() => {
    setIsMarkAsGivenDialogOpen(false);
  }, [setIsMarkAsGivenDialogOpen]);

  const onOpen = React.useCallback(() => {
    setIsMarkAsGivenDialogOpen(true);
  }, [setIsMarkAsGivenDialogOpen]);

  const onError = React.useCallback(() => {
    notify({ message: l10n.itemMarkAsGivenError });
  }, [notify]);

  const onSuccess = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['items', thread.item.id] });
    queryClient.invalidateQueries({ queryKey: ['threads', thread.id] });
    queryClient.invalidateQueries({
      queryKey: ['user', thread.userGiver.id, 'items'],
    });
    notify({ message: l10n.itemMarkAsGivenSuccess });
    onClose();
  }, [onClose, queryClient, thread]);

  if (user!.id !== thread.userGiver.id) {
    return null;
  }

  if (thread.item.isGiven) {
    return null;
  }

  return (
    <CardActions>
      <Button
        color="primary"
        data-testid="thread__item__mark-as-given"
        onClick={onOpen}
        startIcon={<DoneIcon />}
        variant="text"
      >
        {l10n.itemMarkAsGiven}
      </Button>
      <ItemMarkAsGivenDialog
        isOpen={isMarkAsGivenDialogOpen}
        item={thread.item}
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
      />
    </CardActions>
  );
};

export default MarkAsGiven;

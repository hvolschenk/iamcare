import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import threadMarkAsRead from '~/src/api/threads/markAsRead';
import Item from '~/src/components/Item';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { Message as ThreadMessage } from '~/src/types/Thread';
import { User } from '~/src/types/User';
import { threads, root } from '~/src/urls';

import { useThread } from './context';
import Messages from './Messages';
import ReplyForm from './ReplyForm';

const Thread: React.FC = () => {
  const { user } = useAuthentication();
  const queryClient = useQueryClient();
  const { thread } = useThread();

  const { mutate } = useMutation(
    ['threads', thread.id, 'mark-as-read'],
    () => threadMarkAsRead({ id: thread.id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['threads'],
        });
      },
    },
  );

  React.useEffect(() => {
    mutate();
  }, [mutate]);

  interface MessageGroup {
    messages: ThreadMessage['message'][];
    user: User;
  }
  const groupedMessages = React.useMemo<MessageGroup[]>(() => {
    const messageGroups: MessageGroup[] = [];
    thread.messages.forEach((message, index, messages) => {
      const previousMessage = messages[index - 1];
      if (!previousMessage || previousMessage.userID !== message.userID) {
        messageGroups.push({
          messages: [message.message],
          user:
            thread.userGiver.id === message.userID
              ? thread.userGiver
              : thread.userReceiver,
        });
      } else {
        messageGroups[messageGroups.length - 1].messages.push(message.message);
      }
    });
    return messageGroups;
  }, [thread]);

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: l10n.threads, url: threads() },
          { title: thread.item.name },
        ]}
        title={thread.item.name}
      />
      <Box marginBottom={2}>
        <Item item={thread.item} />
      </Box>

      <Card>
        <CardContent>
          {groupedMessages.map((messageGroup, index) => (
            <Messages
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              messages={messageGroup.messages}
              // This page is protected and the user is guaranteed to be logged in
              position={messageGroup.user.id === user!.id ? 'right' : 'left'}
              user={messageGroup.user}
            />
          ))}
          <ReplyForm />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Thread;

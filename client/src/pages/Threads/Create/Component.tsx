import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import Item from '~/src/components/Item';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useSearch } from '~/src/providers/Search';
import type { Item as ItemType } from '~/src/types/Item';
import { item, root } from '~/src/urls';

import Form from './Form';

const ThreadCreate: React.FC = () => {
  useDocumentTitle([l10n.threadCreate]);

  const { user } = useAuthentication();
  const data = useLoaderData() as ItemType;
  const { searchDialogOpen } = useSearch();

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: data.name, url: item(data.id.toString()) },
          { title: l10n.threadCreate },
        ]}
        title={l10n.threadCreate}
      />
      <Card>
        <CardContent>
          <Item item={data} />
          {user!.id === data.user.id && (
            <Alert
              action={
                <Button
                  data-testid="thread-create__error--item-owned"
                  onClick={searchDialogOpen}
                >
                  {l10n.search}
                </Button>
              }
              severity="warning"
            >
              {l10n.threadCreateErrorItemOwned}
            </Alert>
          )}
          {user!.id !== data.user.id && <Form item={data} />}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ThreadCreate;

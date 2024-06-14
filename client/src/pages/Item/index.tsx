import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

import itemGet from '~/src/api/items/get';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';
import { ItemParams, item, root } from '~/src/urls';

import Item from './Item';

const ItemRoot: React.FC = () => {
  const { itemID } = useParams<ItemParams>() as ItemParams;

  const { trackViewItem } = useGoogleAnalytics();
  const { notify } = useNotifications();

  const { data, refetch, status } = useQuery({
    queryFn: () => itemGet({ id: parseInt(itemID, 10) }),
    queryKey: ['items', itemID],
  });

  const documentTitle = React.useMemo<string[]>(() => {
    if (status === 'error') {
      return [l10n.itemDocumentTitleError];
    }
    if (status === 'pending') {
      return [];
    }
    return [data.data.name];
  }, [data, status]);

  useDocumentTitle(documentTitle);

  const onShare = React.useCallback(async () => {
    const shareData: ShareData = {
      title: data!.data.name,
      url: `${window.location.origin}${item(data!.data.id.toString())}`,
    };
    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          notify({ message: l10n.itemShareError });
        }
      }
    }
  }, [data, notify]);

  React.useEffect(() => {
    if (status === 'success') {
      trackViewItem({ item: data.data });
    }
  }, [data, status, trackViewItem]);

  if (status === 'error') {
    return (
      <React.Fragment>
        <PageTitle
          breadcrumbs={[
            { title: l10n.home, url: root() },
            { title: l10n.errorLoading },
          ]}
          title={l10n.errorLoading}
        />
        <Alert
          action={
            <Button data-testid="item__error__retry" onClick={() => refetch()}>
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.itemErrorLoading}
        </Alert>
      </React.Fragment>
    );
  }

  if (status === 'pending') {
    return (
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <PageTitle
        actions={
          <IconButton
            data-testid="item__share"
            disabled={!navigator.canShare}
            onClick={onShare}
          >
            <ShareIcon />
          </IconButton>
        }
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: data.data.name },
        ]}
        title={data.data.name}
      />
      <Item item={data.data} />
    </React.Fragment>
  );
};

export default ItemRoot;

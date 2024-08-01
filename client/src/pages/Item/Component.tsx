import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';
import { Item as ItemType } from '~/src/types/Item';
import { item as itemURL, root } from '~/src/urls';

import Item from './Item';

const ItemRoot: React.FC = () => {
  const { trackShare, trackViewItem } = useGoogleAnalytics();
  const item = useLoaderData() as ItemType;
  const { notify } = useNotifications();

  useDocumentTitle([item.name]);

  const onShare = React.useCallback(async () => {
    const shareData: ShareData = {
      title: item.name,
      url: `${window.location.origin}${itemURL(item.id.toString())}`,
    };
    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        trackShare({ content_type: 'item', item_id: item.id.toString() });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          notify({ message: l10n.itemShareError });
        }
      }
    }
  }, [item, notify, trackShare]);

  React.useEffect(() => {
    trackViewItem({ item });
  }, [item, trackViewItem]);

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
        breadcrumbs={[{ title: l10n.home, url: root() }, { title: item.name }]}
        title={item.name}
      />
      <Item item={item} />
    </React.Fragment>
  );
};

export default ItemRoot;

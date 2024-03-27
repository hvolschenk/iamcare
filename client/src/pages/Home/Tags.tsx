import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import tagsPopular from '~/src/api/tag/popular';
import l10n from '~/src/l10n';
import { L10n } from '~/src/l10n/types';
import { useSearch } from '~/src/providers/Search';
import { Tag } from '~/src/types/Tag';

const getTagLabel = (tag: Tag): string => {
  const title = `${tag.title.charAt(0).toUpperCase()}${tag.title.slice(1)}`;
  const l10nKey: keyof L10n = `itemTag${title}` as keyof L10n;
  return l10n[l10nKey];
};

const Tags: React.FC = () => {
  const { search } = useSearch();

  const { data, refetch, status } = useQuery({
    queryFn: tagsPopular,
    queryKey: ['tags', 'popular'],
  });

  const onTagClick = React.useCallback(
    (tag: Tag) => {
      search({
        filters: { tagIDs: [tag.id] },
      });
    },
    [search],
  );

  return (
    <Card>
      <CardHeader title={l10n.homeTagsTitle} />
      <CardContent>
        {status === 'error' && (
          <Alert
            action={
              <Button
                data-testid="home__tags__error__retry"
                onClick={() => refetch()}
              >
                {l10n.actionTryAgain}
              </Button>
            }
            severity="error"
          >
            {l10n.homeTagsErrorLoading}
          </Alert>
        )}
        {status === 'pending' && (
          <React.Fragment>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </React.Fragment>
        )}

        {status === 'success' && (
          <Grid container spacing={2}>
            {data.data.data.map((tag) => (
              <Grid item key={tag.id} lg={4} md={6} xs={12}>
                <ListItem component="div" disablePadding>
                  <ListItemButton
                    component="div"
                    data-testid="home__tags__tag"
                    onClick={() => onTagClick(tag)}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" gap={1} justifyItems="center">
                          {getTagLabel(tag)}
                          <Chip label={tag.itemsCount} size="small" />
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default Tags;

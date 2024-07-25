import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import React from 'react';

import l10n from '~/src/l10n';
import { L10n } from '~/src/l10n/types';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useSearch } from '~/src/providers/Search';
import { APICollection } from '~/src/types/APICollection';
import { Tag } from '~/src/types/Tag';

const getTagLabel = (tag: Tag): string => {
  const title = `${tag.title.charAt(0).toUpperCase()}${tag.title.slice(1)}`;
  const l10nKey: keyof L10n = `itemTag${title}` as keyof L10n;
  return l10n[l10nKey];
};

interface TagsProps {
  tags: APICollection<Tag>;
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
  const { trackSelectContent } = useGoogleAnalytics();
  const { search } = useSearch();

  const onTagClick = React.useCallback(
    (tag: Tag) => {
      trackSelectContent({ identifier: tag.id, type: 'tag' });
      search({
        filters: { tagIDs: [tag.id] },
      });
    },
    [search, trackSelectContent],
  );

  return (
    <Card>
      <CardHeader title={l10n.homeTagsTitle} />
      <CardContent>
        <Grid container spacing={2}>
          {tags.data.map((tag) => (
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
      </CardContent>
    </Card>
  );
};

export default Tags;

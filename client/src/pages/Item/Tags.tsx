import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import React from 'react';

import { useSearch } from '~/src/providers/Search';
import { getTagLabel } from '~/src/shared/tags';
import type { Item } from '~/src/types/Item';
import type { Tag } from '~/src/types/Tag';

interface TagsProps {
  item: Item;
}

const Tags: React.FC<TagsProps> = ({ item }) => {
  const { search } = useSearch();

  const onGoToTag = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, tag: Tag) => {
      event.preventDefault();
      search({ filters: { tagIDs: [tag.id] } });
    },
    [search],
  );

  return (
    <Stack direction="row" spacing={1}>
      {item.tags.map((tag) => (
        <Chip
          data-testid="item__tag"
          key={tag.id}
          label={getTagLabel(tag)}
          onClick={(event) => onGoToTag(event, tag)}
          size="small"
        />
      ))}
    </Stack>
  );
};

export default Tags;

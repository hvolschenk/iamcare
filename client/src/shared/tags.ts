import l10n from '~/src/l10n';
import type { L10n } from '~/src/l10n/types';
import type { Tag } from '~/src/types/Tag';

export const getTagLabel = (tag: Tag): string => {
  const title = `${tag.title.charAt(0).toUpperCase()}${tag.title.slice(1)}`;
  const l10nKey: keyof L10n = `itemTag${title}` as keyof L10n;
  return l10n[l10nKey];
};

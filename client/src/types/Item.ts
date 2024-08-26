import type { Image } from '~/src/types/Image';
import type { LocationBasic } from '~/src/types/LocationBasic';
import type { Tag } from '~/src/types/Tag';
import type { User } from '~/src/types/User';

export interface Item {
  description: string;
  id: number;
  images: Image[];
  isGiven: boolean;
  location: LocationBasic;
  name: string;
  tags: Tag[];
  user: User;
}

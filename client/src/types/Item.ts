import { Image } from '~/src/types/Image';
import { LocationBasic } from '~/src/types/LocationBasic';
import { Tag } from '~/src/types/Tag';
import { User } from '~/src/types/User';

export interface Item {
  description: string;
  id: number;
  images: Image[];
  location: LocationBasic;
  name: string;
  tags: Tag[];
  user: User;
}

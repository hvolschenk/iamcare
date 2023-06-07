import { Category } from '~/src/types/Category';
import { Image } from '~/src/types/Image';
import { LocationBasic } from '~/src/types/LocationBasic';
import { User } from '~/src/types/User';

export interface Item {
  category: Category;
  description: string;
  id: number;
  images: Image[];
  location: LocationBasic;
  name: string;
  user: User;
}

export type ItemCreate = Omit<
  Item,
  'category' | 'id' | 'images' | 'location' | 'user'
> & {
  category: string;
  images: File[];
  location: Pick<LocationBasic, 'placeID'>;
};

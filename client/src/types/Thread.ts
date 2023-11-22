import { Item } from './Item';
import { User } from './User';

export interface Message {
  dateCreated: string;
  dateUpdated?: string;
  id: number;
  message: string;
  userID: User['id'];
}

export interface Thread {
  dateCreated: string;
  dateUpdated?: string;
  hasUnreadMessages: boolean;
  id: number;
  item: Item;
  messages: Message[];
  userGiver: User;
  userReceiver: User;
}

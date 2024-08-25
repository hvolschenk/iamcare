import type { LocationBasic } from '~/src/types/LocationBasic';
import type { Tag } from '~/src/types/Tag';

export interface SearchFilters {
  distance?: number;
  googlePlaceID?: LocationBasic['googlePlaceID'];
  tagIDs: Tag['id'][];
}

export interface SearchOptions {
  filters?: SearchFilters;
  page?: number;
  query?: string;
}

export interface Search {
  filters: SearchFilters;
  hasFilter: boolean;
  hasQuery: boolean;
  page: number;
  query?: string;
  search(options: SearchOptions): void;
  searchDialogOpen(): void;
}

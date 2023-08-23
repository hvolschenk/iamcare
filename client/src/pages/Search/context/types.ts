export interface SearchFilters {
  distance: string;
  location: string;
  query: string;
}

export interface SearchProviderValues {
  filters: SearchFilters;
  page: number;
  setFilters(filters: SearchFilters): void;
  setPage(page: number): void;
}

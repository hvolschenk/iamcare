export interface LocationBasic {
  address: string;
  dateCreated: string;
  dateUpdated?: string;
  googlePlaceID: string;
  id: number;
  itemsCount?: number;
  language: 'af' | 'en' | 'nl';
  latitude: number;
  longitude: number;
  name: string;
  utcOffset: string;
}

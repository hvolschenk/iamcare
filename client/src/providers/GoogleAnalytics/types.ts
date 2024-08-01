import { SearchFilters } from '~/src/providers/Search/types';
import { Item } from '~/src/types/Item';

export interface TrackCustomEventOptions {
  action: string;
  category: string;
  label?: string;
  nonInteraction?: boolean;
  transport?: 'beacon' | 'image' | 'xhr';
  value?: number;
}

export interface TrackExceptionOptions {
  description: string;
  fatal: boolean;
}

export interface TrackLoginOptions {
  method: string;
}

export interface TrackPageViewOptions {
  page: string;
  title?: string;
}

export interface TrackSearchOptions {
  filters?: SearchFilters;
  query?: string;
}

export interface TrackSelectContentOptions {
  identifier: number | string;
  type: string;
}

export interface TrackSelectItemOptions {
  item: Item;
}

export interface TrackShareOptions {
  content_type: string;
  item_id: string;
  method?: string;
}

export interface TrackViewItemOptions {
  item: Item;
}

export interface TrackViewItemListOptions {
  items: Item[];
  listIdentifier?: string;
  listName?: string;
}

export interface GoogleAnalyticsProviderValues {
  initialize(): void;
  set(fields: Record<string, any>): void;
  trackCustomEvent(
    options: TrackCustomEventOptions,
    additionalParameters?: Record<string, any>,
  ): void;
  trackException(options: TrackExceptionOptions): void;
  trackLogin(options: TrackLoginOptions): void;
  trackPageView(options: TrackPageViewOptions): void;
  trackSearch(options: TrackSearchOptions): void;
  trackSelectContent(options: TrackSelectContentOptions): void;
  trackSelectItem(options: TrackSelectItemOptions): void;
  trackShare(options: TrackShareOptions): void;
  trackViewItem(options: TrackViewItemOptions): void;
  trackViewItemList(options: TrackViewItemListOptions): void;
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#add_to_cart_item
export interface GoogleAnalyticsItem {
  affiliation?: string;
  coupon?: string;
  index?: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_id: string;
  item_list_id?: string;
  item_list_name?: string;
  item_name: string;
  item_variant?: string;
  location_id?: string;
  price?: number;
  quantity?: number;
}

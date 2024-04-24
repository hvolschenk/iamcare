export interface TrackCustomEventOptions {
  action: string;
  category: string;
  label?: string;
  nonInteraction?: boolean;
  transport?: 'beacon' | 'image' | 'xhr';
  value?: number;
}

export interface TrackPageViewOptions {
  page: string;
  title?: string;
}

export interface GoogleAnalyticsProviderValues {
  initialize(): void;
  trackCustomEvent(options: TrackCustomEventOptions): void;
  trackPageView(options: TrackPageViewOptions): void;
}

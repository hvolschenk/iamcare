import React from 'react';
import ReactGA from 'react-ga4';

import configuration from '~/src/configuration';
import { Item } from '~/src/types/Item';

import GoogleAnalyticsContext from './context';
import { GoogleAnalyticsItem, GoogleAnalyticsProviderValues } from './types';

interface GoogleAnalyticsProviderProps {
  children: React.ReactNode;
}

const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({
  children,
}) => {
  const itemToGoogleAnalyticsItem = React.useCallback(
    (item: Item, index?: number): GoogleAnalyticsItem => ({
      index,
      item_category: item.tags[0]?.title,
      item_category2: item.tags[1]?.title,
      item_category3: item.tags[2]?.title,
      item_category4: item.tags[3]?.title,
      item_category5: item.tags[4]?.title,
      item_id: item.id.toString(),
      item_name: item.name,
      location_id: item.location.googlePlaceID,
      price: 1,
    }),
    [],
  );

  const initialize: GoogleAnalyticsProviderValues['initialize'] =
    React.useCallback(() => {
      ReactGA.initialize(configuration.google.analytics.measurementID(), {
        nonce: configuration.google.analytics.nonce(),
      });
    }, []);

  const set: GoogleAnalyticsProviderValues['set'] = React.useCallback(
    (fields) => {
      ReactGA.set(fields);
    },
    [],
  );

  const trackCustomEvent: GoogleAnalyticsProviderValues['trackCustomEvent'] =
    React.useCallback((options, additionalParameters) => {
      ReactGA.event(options, additionalParameters);
    }, []);

  const trackException: GoogleAnalyticsProviderValues['trackException'] =
    React.useCallback((options) => {
      ReactGA.event('exception', options);
    }, []);

  const trackLogin: GoogleAnalyticsProviderValues['trackLogin'] =
    React.useCallback((options) => {
      ReactGA.event('login', { method: options.method });
    }, []);

  const trackPageView: GoogleAnalyticsProviderValues['trackPageView'] =
    React.useCallback((options) => {
      ReactGA.send({ hitType: 'pageview', ...options });
    }, []);

  const trackSearch: GoogleAnalyticsProviderValues['trackSearch'] =
    React.useCallback((options) => {
      ReactGA.event('search', {
        search_term: options.query || '',
        ...options.filters,
      });
    }, []);

  const trackSelectContent: GoogleAnalyticsProviderValues['trackSelectContent'] =
    React.useCallback((options) => {
      ReactGA.event('select_content', {
        content_id: options.identifier,
        content_type: options.type,
      });
    }, []);

  const trackSelectItem: GoogleAnalyticsProviderValues['trackSelectItem'] =
    React.useCallback((options) => {
      ReactGA.event('select_item', {
        items: [itemToGoogleAnalyticsItem(options.item)],
      });
    }, []);

  const trackShare: GoogleAnalyticsProviderValues['trackShare'] =
    React.useCallback((options) => ReactGA.event('share', options), []);

  const trackViewItem: GoogleAnalyticsProviderValues['trackViewItem'] =
    React.useCallback(
      (options) => {
        ReactGA.event('view_item', {
          currency: 'USD',
          items: [itemToGoogleAnalyticsItem(options.item)],
          value: 1,
        });
      },
      [itemToGoogleAnalyticsItem],
    );

  const trackViewItemList: GoogleAnalyticsProviderValues['trackViewItemList'] =
    React.useCallback(
      (options) => {
        ReactGA.event('view_item_list', {
          item_list_id: options.listIdentifier,
          item_list_name: options.listName,
          items: options.items.map(itemToGoogleAnalyticsItem),
        });
      },
      [itemToGoogleAnalyticsItem],
    );

  const providerValue = React.useMemo<GoogleAnalyticsProviderValues>(
    () => ({
      initialize,
      set,
      trackCustomEvent,
      trackException,
      trackLogin,
      trackPageView,
      trackSearch,
      trackSelectContent,
      trackSelectItem,
      trackShare,
      trackViewItem,
      trackViewItemList,
    }),
    [
      initialize,
      set,
      trackCustomEvent,
      trackException,
      trackLogin,
      trackPageView,
      trackSearch,
      trackSelectContent,
      trackSelectItem,
      trackShare,
      trackViewItem,
      trackViewItemList,
    ],
  );

  return (
    <GoogleAnalyticsContext.Provider value={providerValue}>
      {children}
    </GoogleAnalyticsContext.Provider>
  );
};

export default GoogleAnalyticsProvider;

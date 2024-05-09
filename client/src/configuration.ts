interface Configuration {
  api: {
    baseURL(): string;
  };
  application: {
    hasCookiesBanner(): boolean;
  };
  gitHub: {
    url(): string;
  };
  google: {
    analytics: {
      measurementID(): string;
      nonce(): string;
    };
    oAuth: {
      clientID(): string;
    };
    places: {
      apiKey(): string;
      countryCode(): string;
      nonce(): string;
    };
  };
  query: {
    isDevtoolsVisible(): boolean;
  };
}

const configuration: Configuration = {
  api: {
    baseURL: () => process.env.API_BASE_URL,
  },
  application: {
    hasCookiesBanner: () => process.env.HAS_COOKIES_BANNER === 'true',
  },
  gitHub: {
    url: () => process.env.GITHUB_URL,
  },
  google: {
    analytics: {
      measurementID: () => process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
      nonce: () => process.env.GOOGLE_ANALYTICS_NONCE,
    },
    oAuth: {
      clientID: () => process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
    places: {
      apiKey: () => process.env.GOOGLE_PLACES_API_KEY,
      countryCode: () => process.env.GOOGLE_PLACES_COUNTRY_CODE,
      nonce: () => process.env.GOOGLE_PLACES_NONCE,
    },
  },
  query: {
    isDevtoolsVisible: () => process.env.QUERY_DEVTOOLS_VISIBLE === 'true',
  },
};

export default configuration;

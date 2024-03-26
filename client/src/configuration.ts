interface Configuration {
  api: {
    baseURL(): string;
  };
  gitHub: {
    url(): string;
  };
  google: {
    oAuth: {
      clientID(): string;
    };
    places: {
      apiKey(): string;
      countryCode(): string;
    };
  };
}

const configuration: Configuration = {
  api: {
    baseURL: () => process.env.API_BASE_URL,
  },
  gitHub: {
    url: () => process.env.GITHUB_URL,
  },
  google: {
    oAuth: {
      clientID: () => process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
    places: {
      apiKey: () => process.env.GOOGLE_PLACES_API_KEY,
      countryCode: () => process.env.GOOGLE_PLACES_COUNTRY_CODE,
    },
  },
};

export default configuration;

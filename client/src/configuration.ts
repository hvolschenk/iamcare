interface Configuration {
  api: {
    baseURL(): string;
  };
  google: {
    oAuth: {
      clientID(): string;
    };
  };
}

const configuration: Configuration = {
  api: {
    baseURL: () => process.env.API_BASE_URL,
  },
  google: {
    oAuth: {
      clientID: () => process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
  },
};

export default configuration;

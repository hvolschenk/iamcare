interface Configuration {
  api: {
    baseURL(): string;
  };
}

const configuration: Configuration = {
  api: {
    baseURL: () => process.env.API_BASE_URL,
  },
};

export default configuration;

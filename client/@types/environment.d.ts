declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_BASE_URL: string;
      GITHUB_URL: string;
      GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
      GOOGLE_ANALYTICS_NONCE: string;
      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_PLACES_API_KEY: string;
      GOOGLE_PLACES_COUNTRY_CODE: string;
      GOOGLE_PLACES_NONCE: string;
      HAS_COOKIES_BANNER: 'false' | 'true';
      NODE_ENV: 'development' | 'production';
      PWD: string;
      QUERY_DEVTOOLS_VISIBLE: 'false' | 'true';
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

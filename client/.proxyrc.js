const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use((request, response, next) => {
    if (!request.url.startsWith('/api')) {
      const contentSecurityPolicy = [
        ['default-src', "'self'"].join(' '),
        [
          'connect-src',
          "'self'",
          'https://*.google-analytics.com',
          'https://maps.googleapis.com',
        ].join(' '),
        ['font-src', 'https://fonts.gstatic.com'].join(' '),
        [
          'img-src',
          "'self'",
          'blob:',
          process.env.API_URL,
          'https://*.googleusercontent.com',
          'https://www.googletagmanager.com',
        ].join(' '),
        [
          'script-src',
          "'self'",
          // This is ONLY for development, and this rule (unsafe-inline)
          // may NOT be copied over to production.
          // The `react-error-overlay` keeps moaning about this
          // and provides no alternative.
          "'unsafe-inline'",
          `nonce-${process.env.GOOGLE_ANALYTICS_NONCE}`,
          'https://accounts.google.com',
          'https://maps.googleapis.com',
          'https://www.googletagmanager.com',
        ].join(' '),
        [
          'style-src',
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ].join(' '),
      ].join('; ');
      response.setHeader('Content-Security-Policy', contentSecurityPolicy);
      response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    }
    next();
  });

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://api:8000/',
      pathRewrite: {
        '^/api': '',
      },
    }),
  );
};

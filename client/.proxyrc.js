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
        ].join(' '),
        [
          'script-src',
          "'self'",
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

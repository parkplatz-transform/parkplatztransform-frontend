const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['^/segments/*', '^/users/*'],
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'https://api.xtransform.org',
      changeOrigin: true,
    })
  );
};
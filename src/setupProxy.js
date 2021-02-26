const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['^/segments/*', '^/users/*'],
    createProxyMiddleware({
      target: 'https://api.xtransform.org',
      changeOrigin: true,
    })
  );
};
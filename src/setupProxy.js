const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/sxnw',
        createProxyMiddleware({
            target: 'http://60.208.72.35:8086/dataIntf',
            changeOrigin: true,
            pathRewrite: {
                '^/sxnw': ''
            }
        })
    );
};
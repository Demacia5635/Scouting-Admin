const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/frcapi',
        createProxyMiddleware({
            target: 'https://frc-api.firstinspires.org/',
            changeOrigin: true,
            pathRewrite: (path) => {
                return path.replace("/frcapi", "/")
            }
        })
    );
};

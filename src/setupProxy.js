const { createProxyMiddleware } = require('http-proxy-middleware')
const { env } = require("process")

module.exports = function (app) {
    app.use(
        '/frcapi',
        createProxyMiddleware({
            target: 'https://frc-api.firstinspires.org/',
            changeOrigin: true,
            pathRewrite: (path) => {
                return path.replace("/frcapi", "/")
            },
            auth: `${env.REACT_APP_FRC_API_TOKEN}`
        })
    );
};

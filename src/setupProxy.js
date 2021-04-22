const  { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use('/api',createProxyMiddleware({
        target: 'http://localhost:8089',
        // target: 'http://192.168.19.105:8055',
        changeOrigin: true,
        pathRewrite:{
            "^/api":""
        }
    }))
}
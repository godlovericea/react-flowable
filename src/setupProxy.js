const  { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use('/api',createProxyMiddleware({
        target: 'http://192.168.12.53:8089',
        changeOrigin: true,
        pathRewrite:{
            "^/api":""
        }
    }))
}
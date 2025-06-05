const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    entry: './src/main.ts',
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      })
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'https://api.sandbox.payinpos.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api/v1' // rewrites /api/product/ to /api/v1/product/
        }
      }
    },
    client: {
    webSocketURL: 'ws://localhost:8000/ws',
  },
  }
})

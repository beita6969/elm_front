const { defineConfig } = require('@vue/cli-service')

module.exports = {
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http:
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
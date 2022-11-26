const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  devServer: {
    proxyTable: {
      '/api': {
        target: 'http://www.wchecker.cn/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''   //实际请求去掉/api以空字符串代替

        }
      }
    }
  }
})

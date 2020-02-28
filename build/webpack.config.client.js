const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const NameAllModulesPlugin = require('name-all-modules-plugin')
const baseConfig = require('./webpack.base')
const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },

  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
  },

  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]

})

if (isDev) {
  config.devtool = '#cheap-module-eval-source-map'
  config.entry = [
    'react-hot-loader/patch',
    path.join(__dirname, '../client/app.js')
  ]

  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    // contentBase: path.join(__dirname, './dist'),
    hot: true,
    overlay: { // 编译过程出错，直接在网页显示
      errors: true
    },
    publicPath: '/public/', // 静态资源访问路径
    historyApiFallback: {
      index: '/public/index.html' // 单页应用显示地址
    },
    proxy: {
      '/api': 'http://127.0.0.1:3333'
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.entry = {
    app: path.join(__dirname, '../client/app.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'axios',
      'dateformat',
      'marked'
    ]
  }
  config.output.filename = '[name].[chunkhash].js'
  // config.output.publicPath = cdnConfig.host
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.NamedModulesPlugin(),
    new NameAllModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    })
  )
}

module.exports = config

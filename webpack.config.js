
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptRetryPlugin = require('./ScriptRetryPlugin')

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    }),
    new ScriptRetryPlugin()
  ]
}

module.exports = config

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
    new ScriptRetryPlugin([
      {
        target: 'main',
        attrs : [
          {
            customKey: 'data-retry',
            value: '1'
          }
        ]
      }
    ])
  ]
}

module.exports = config
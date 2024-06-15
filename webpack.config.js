
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptTagAddCustomAttrsPlugin = require('./ScriptTagAddCustomAttrsPlugin')

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    }),
    new ScriptTagAddCustomAttrsPlugin([
      {
        target: 'main',
        attrs : [
          {
            customKey: 'data-retry',
            value: '2'
          },
          {
            customKey: 'data-v',
            value: 'ahlfasdf'
          }
        ]
      }
    ])
  ]
}

module.exports = config
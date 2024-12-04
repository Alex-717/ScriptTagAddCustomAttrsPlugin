const HtmlWebpackPlugin = require("html-webpack-plugin");
const PluginName = 'ScriptRetryPlugin'
const path = require('path')

class ScriptRetryPlugin {
  constructor (options = []) {
    if (!Array.isArray(options)) {
      throw(new Error('🚀🚀--ScriptRetryPlugin error~~: options is an Array'))
    }
    this.options = options
  }
  apply (compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      if (HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          PluginName,
          (data, cb) => {
            setCustomAttrs(this.options, data)
            cb(null, data)
          }
        )
      } else {
        // 兼容老版本html-webpack-plugin、webpack
        compilation.plugin(
          'html-webpack-plugin-alter-asset-tags',
          (data) => {
            let oriData = data.head
            if ([true, 'body'].includes(data.plugin.options.inject)) {
              oriData = data.body
            }
            const newData = {
              assetTags: {
                scripts: oriData || []
              }
            }
            setCustomAttrs(this.options, newData)
          }
        )
      }
    })
  }
}

const defaultOptions = [
  {
    key: 'data-retry',
    value: 1
  }
]

function setCustomAttrs (options = [], data) {
  if(!options.find(item => item.key === 'data-retry')) {
    options.push(...defaultOptions)
  }

  const { scripts = null } = data.assetTags || {}

  if (Array.isArray(scripts) && scripts.length) {
    scripts.forEach(item => {
      options.forEach(it => {
        item.attributes[it.key] = it.value
      })
    })
  }
}

module.exports = ScriptRetryPlugin

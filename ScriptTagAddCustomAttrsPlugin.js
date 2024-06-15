const HtmlWebpackPlugin = require("html-webpack-plugin");
const PluginName = 'ScriptTagAddCustomAttrsPlugin'

class ScriptTagAddCustomAttrsPlugin {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {

      // HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
      //   PluginName,
      //   (data, cb) => {
      //     console.log('🐷', data)
      //     cb(null, data)
      //   }
      // )

      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        PluginName,
        (data, cb) => {
          // console.log('🐷🐷', data)
          setCustomAttrs(this.options, data)
          cb(null, data)
        }
      )

      // HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
      //   PluginName,
      //   (data, cb) => {
      //     console.log('🐷🐷🐷', data.bodyTags)
      //     // console.log('ddddd++', data.a)
      //     cb(null, data)
      //   }
      // )

      // HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
      //   PluginName,
      //   (data, cb) => {
      //     console.log('🐷🐷🐷', data)
      //     console.log('ddddd++', data.bodyTags[0])
      //     // data.headTags[0].attributes['data-retry'] = 2
      //     cb(null, data)
      //   }
      // )
    })
  }
}

function setCustomAttrs (options, data) {
  const { scripts = null } = data.assetTags || {}

  if (Array.isArray(scripts) && scripts.length) {
    scripts.forEach(item => {
      const targetOption = getTargetOption(item, options)
      if (!targetOption) return
      const { attrs = [] } = targetOption
      attrs.forEach(it => {
        item.attributes[it.customKey] = it.value
      })
    })
  }
}

function getTargetOption (item, options) {
  if (item.tagName !== 'script') return void 0
  const scriptSrc = item.attributes.src
  const target = options.find(it => {
    return scriptSrc.startsWith(it.target)
  })
  return target
}

module.exports = ScriptTagAddCustomAttrsPlugin

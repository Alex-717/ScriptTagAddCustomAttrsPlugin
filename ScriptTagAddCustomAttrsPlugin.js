const HtmlWebpackPlugin = require("html-webpack-plugin");
const PluginName = 'ScriptTagAddCustomAttrsPlugin'
const path = require('path')

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
       
      // compilation.plugin(
      //   'html-webpack-plugin-before-html-processing',
      //   (data, cb) => {
      //     data.html += 'The Magic Footer'
   
      //     cb(null, data)
      //   }
      // )
      if (HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          PluginName,
          (data, cb) => {
            // console.log('🐷🐷', data)
            setCustomAttrs(this.options, data)
            cb(null, data)
          }
        )
      } else {
        // 兼容老版本html-webpack-plugin、webpack
        compilation.plugin(
          'html-webpack-plugin-alter-asset-tags',
          (data) => {
            console.log('😂', data)
            let oriData = data.head
            if ([true, 'body'].includes(data.plugin.options.inject)) {
              oriData = data.body
            }
            const newData = {
              assetTags: {
                scripts: [
                  ...oriData
                ]
              }
            }
            setCustomAttrs(this.options, newData)
          }
        )
      }
      

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

  const fileName = getFileName(item.attributes.src)
  const target = options.find(it => {
    // return fileName.startsWith(it.target)
    return fileName.indexOf(it.target) > -1
  })
  // console.log('targetOption', target)
  return target
}

function getFileName (src) {
  const name = path.basename(src, path.extname(src))
  console.log('fileName', name)
  return name
}

module.exports = ScriptTagAddCustomAttrsPlugin

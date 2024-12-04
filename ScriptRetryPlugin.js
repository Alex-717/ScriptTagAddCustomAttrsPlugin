const HtmlWebpackPlugin = require("html-webpack-plugin");
const PluginName = 'ScriptRetryPlugin'
const path = require('path')

const fs = require('fs')

class ScriptTagAddCustomAttrsPlugin {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      if (HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          PluginName,
          (data, cb) => {
            fs.writeFile('./data.json', JSON.stringify(data), ()=>{})
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

function setCustomAttrs (options, data) {
  // console.log('🚀---', options)
  const { scripts = null } = data.assetTags || {}
  
  if (Array.isArray(scripts) && scripts.length) {
    scripts.forEach(item => {
      const targetOption = getTargetOption(item, options)
      console.log('🚀--targetOption-', targetOption)

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

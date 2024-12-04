const HtmlWebpackPlugin = require("html-webpack-plugin");
const PluginName = 'ScriptRetryPlugin'
const path = require('path')
const { parse } = require('node-html-parser')
const fs = require('fs')

class ScriptRetryPlugin {
  constructor (options = []) {
    if (!Array.isArray(options)) {
      throw(new Error('🚀🚀--ScriptRetryPlugin error~~: options is an Array'))
    }
    this.options = options
  }
  apply (compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      // 给script标签上添加自定义属性，默认添加data-retry
      this.setAttrs(compilation)

      // 往html的head标签中注入script重试逻辑
      this.injectRetryLogic(compilation)
    })
  }
  setAttrs (compilation) {
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
  }
  injectRetryLogic (compilation) {
    if (HtmlWebpackPlugin.getHooks) {

      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        PluginName,
        (data, cb) => {
          injectCode(data, cb)
        }
      )

    } else {
      // TODO: 兼容老版本webpack
    }
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

function injectCode (data, cb) {
  const { html: htmlStr } = data
  const root = parse(htmlStr)
  // TODO: 如果html没有head标签，手动给他创建一个
  const headEl = root.getElementsByTagName('head')[0]
  const filePath = path.resolve(__dirname, './scriptRetryLogic.js')
  const insertStr = fs.readFileSync(filePath, { encoding: 'utf-8' })

  const node = parse(`<script>${insertStr}</script>`);
  headEl.childNodes.unshift(node.removeWhitespace())

  const newHtmlStr = root.toString()
  data.html = newHtmlStr
  cb(null, data)
}

module.exports = ScriptRetryPlugin

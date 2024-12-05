const HtmlWebpackPlugin = require("html-webpack-plugin");
const PluginName = 'ScriptRetryPlugin'
const path = require('path')
const { parse } = require('node-html-parser')
const fs = require('fs');

const isJS = (file) => /\.js(\?[^.]+)?$/.test(file);
const isHtml = (file) => /\.html$/.test(file);

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

    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      const allChunks = []
      for (let chunk of compilation.chunks) {
        const { files } = chunk
        if (!Array.isArray(files) || (Array.isArray(files) && !files.length)) continue
        files.forEach(file => {
          if (isJS(file)) {
            allChunks.push(path.basename(file))
          }
        })
      }
      const code = `
        var __all_chunks__ = ${JSON.stringify(allChunks)}
      `
     
      for (const [key, value] of Object.entries(compilation.assets)) {
        if (isHtml(key)) {
          const htmlStr = value.source()
          const newHtmlStr = injectCode(htmlStr, code)
          compilation.assets[key] = {
            source: () => newHtmlStr,
            size: () => newHtmlStr.length
          }
        }
      }
      callback()
    });
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
          const filePath = path.resolve(__dirname, './scriptRetryLogic.js')
          const jsCode = fs.readFileSync(filePath, { encoding: 'utf-8' })
          const newHTMLStr = injectCode(data.html, jsCode)
          data.html = newHTMLStr
          cb()
        }
      )
    } else {
      // TODO: 兼容老版本webpack
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data) => {
          const filePath = path.resolve(__dirname, './scriptRetryLogic.js')
          const jsCode = fs.readFileSync(filePath, { encoding: 'utf-8' })
          const newHTMLStr = injectCode(data.html, jsCode)
          data.html = newHTMLStr

          // TODO: 下面是老版本的html-webpack-plugin才有的，新的需要兼容下
          const mainChunks = []
          const { assets: { chunks } } = data
          for (const [key, value] of Object.entries(chunks)) {
            const { entry } = value
            if (isJS(entry)) {
              mainChunks.push(path.basename(entry))
            }
          }

          const code = `
            var __main_chunks__ = ${JSON.stringify(mainChunks)}
          `
          data.html = injectCode(data.html, code)
        }
      )
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

function injectCode (htmlStr, str) {
  const root = parse(htmlStr)
  // TODO: 如果html没有head标签，手动给他创建一个
  const headEl = root.getElementsByTagName('head')[0]

  const node = parse(`<script>${str}</script>`);
  headEl.childNodes.unshift(node.removeWhitespace())

  const newHtmlStr = root.toString()
  return newHtmlStr
}

module.exports = ScriptRetryPlugin

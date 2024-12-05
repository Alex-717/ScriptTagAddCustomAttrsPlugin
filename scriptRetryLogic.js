// __all_chunks__  __main_chunks__

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.scriptFailedReloadLib = {}));
})(this, (function (exports) { 'use strict';

  var inBrowser = typeof window !== 'undefined';
  var map = {};
  function register() {
    if (!inBrowser) return;
    window.addEventListener('error', scriptLoadFailedHandler, true);
  }
  function scriptLoadFailedHandler(event) {
    var target = event.target;
    const attrs = target.attributes
    console.log('++++++++', attrs)
    var _target$src = target.src,
      src = _target$src === void 0 ? '' : _target$src;
    // console.log('🐷🐷', target.tagName)
    if (!isScriptLoadFailError(event)) return;
    var retry = target.dataset.retry ? +target.dataset.retry : 0;
    var leftRetryTimes = getRetryTimes(src, retry);
    if (leftRetryTimes > 0) {
      // document.write("<scr" + "ipt src = " + src + "></scr" + "ipt>")
      const str = getScriptStr(attrs)
      document.write(str)
      reduceRetryTimes(src);
    }
  }

  function getScriptStr (attrs) {
    let str = "<script"
    Array.prototype.slice.call(attrs).forEach(attr => {
      str += " "
      if (attr.value !== '') {
        str += attr.name + '=' + "\"" + attr.value + "\""
      } else {
        str += attr.name
      }
    })
    str += "></scr" + "ipt>"
    return str
  }

  function getRetryTimes(src, retry) {
    if (map[src] === void 0) {
      map[src] = retry;
    }
    return map[src];
  }
  function reduceRetryTimes(src) {
    if (map[src] !== void 0) {
      map[src]--;
    }
  }
  function isScriptLoadFailError(event) {
    if (ErrorEvent.prototype.isPrototypeOf(event)) return false;
    var target = event.target;
    var _target$src2 = target.src,
      src = _target$src2 === void 0 ? '' : _target$src2;
    if (!src) return false;
    if (!target.tagName || target.tagName && target.tagName.toLowerCase() !== 'script') return false;
    return true;
  }

  exports.default = register;
  exports.register = register;

  register()

  Object.defineProperty(exports, '__esModule', { value: true });
}));
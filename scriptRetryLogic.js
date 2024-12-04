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
    var _target$src = target.src,
      src = _target$src === void 0 ? '' : _target$src;
    // console.log('🐷🐷', target.tagName)
    if (!isScriptLoadFailError(event)) return;
    var retry = target.dataset.retry ? +target.dataset.retry : 0;
    var leftRetryTimes = getRetryTimes(src, retry);
    if (leftRetryTimes > 0) {
      // console.dir(target)
      document.write("<script src=\"".concat(src, "\"></script>"));
      reduceRetryTimes(src);
    }
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

  Object.defineProperty(exports, '__esModule', { value: true });

}));

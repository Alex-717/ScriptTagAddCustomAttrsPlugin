// __all_chunks__  __main_chunks__
(function() {
  const originalAppendChild = HTMLElement.prototype.appendChild;
  HTMLElement.prototype.appendChild = function(newChild) {
    console.log(`Appending element: ${newChild.tagName || newChild.nodeName}`);
    var __all_chunks__ = window.__all_chunks__
    var __main_chunks__ = window.__main_chunks__
    var asyncChunks = []
    __all_chunks__.forEach(item => {
      if (__main_chunks__.indexOf(item) === -1) {
        asyncChunks.push(item)
      }
    })

    function isAsyncScript (src) {
      var tag = false
      for (var i = 0; i < asyncChunks.length; i++) {
        var d = asyncChunks[i]
        if (src.indexOf(d) > -1) {
          tag = true
          break
        }
      }
      return tag
    }

    // 是异步加载的js
    if (newChild.tagName.toLowerCase() === 'script' && isAsyncScript(newChild.src)) {
      
    }

    return originalAppendChild.call(this, newChild);
  };
})();
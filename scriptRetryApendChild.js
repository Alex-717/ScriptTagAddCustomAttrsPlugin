// __all_chunks__  __main_chunks__
(function() {
  const originalAppendChild = HTMLElement.prototype.appendChild;
  HTMLElement.prototype.appendChild = function(newChild) {
    console.log(`Appending element: ${newChild.tagName || newChild.nodeName}`);
    var __all_chunks__ = window.__all_chunks__
    var __main_chunks__ = window.__main_chunks__
    var asyncChunks = []
    __all_chunks__.forEach(item => {
      __main_chunks__
    })

    return originalAppendChild.call(this, newChild);
  };
})();
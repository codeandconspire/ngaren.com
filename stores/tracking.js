/* global gtag */

module.exports = tracking

function tracking (state, emitter) {
  var href = state.href
  emitter.on('meta', function (data) {
    if (typeof gtag !== 'function') return
    if (href === state.href || !data.title) return
    href = state.href
    gtag('config', 'UA-149916358-1', {
      'page_title': data.title,
      'page_path': href
    })
  })
}

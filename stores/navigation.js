module.exports = navigation

function navigation (state, emitter) {
  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  function onnavigate (href, opts = {}) {
    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0)
    })
  }
}

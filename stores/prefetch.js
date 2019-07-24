var { Predicates } = require('prismic-javascript')

// stores/prefetch.js
module.exports = function (state, emitter) {
  if (!state.prefetch) return
  state.prismic.get(Predicates.at('document.type', 'page'), function (err, response) {
    if (err || !response) return null
    response.results.forEach(function (doc) {
      state.prismic.getByUID('page', doc.uid)
    })
  })
}

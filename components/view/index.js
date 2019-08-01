var html = require('choo/html')
var raw = require('choo/html/raw')
var error = require('./error')
var { asText } = require('../base')
var Header = require('../header')
var footer = require('../footer')

var DEFAULT_TITLE = 'Ngaren'

module.exports = createView

function createView (view, getMeta) {
  return function (state, emit) {
    return state.prismic.getSingle('website', function (err, doc) {
      var children
      var meta = {}

      try {
        if (err) throw err
        children = view(state, emit)
        meta = meta ? getMeta(state) : {}

        if (meta && meta.title && meta.title !== DEFAULT_TITLE) {
          meta.title = `${meta.title} – ${DEFAULT_TITLE}`
        }

        let defaults = {
          title: doc ? asText(doc.data.title) : DEFAULT_TITLE,
          description: doc ? asText(doc.data.description) : null
        }

        if (doc && doc.data.featured_image && doc.data.featured_image.url) {
          defaults['og:image'] = doc.data.featured_image.url
          defaults['og:image:width'] = doc.data.featured_image.dimensions.width
          defaults['og:image:height'] = doc.data.featured_image.dimensions.height
        }

        emit('meta', Object.assign(defaults, meta))
      } catch (err) {
        err.status = state.offline ? 503 : err.status || 500
        children = error(err, state, emit)
        emit('meta', { title: `Error – ${DEFAULT_TITLE}` })
      }

      if (typeof document !== 'undefined') {
        document.addEventListener('touchstart', function () {}, false)
      }

      return html`
        <body class="View" id="view">
          <script type="application/ld+json">${raw(JSON.stringify(linkedData(state)))}</script>
          ${state.cache(Header, 'header').render(state.params.page)}
          ${children}
          <div class="u-container">
            ${footer()}
          </div>
        </body>
      `

      // format document as schema-compatible linked data table
      // obj -> obj
      function linkedData (state) {
        return {
          '@context': 'http://schema.org',
          '@type': 'Organization',
          name: DEFAULT_TITLE,
          url: state.origin,
          logo: state.origin + '/icon.png'
        }
      }
    })
  }
}

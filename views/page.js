var html = require('choo/html')
var view = require('../components/view')
var slices = require('../components/slices')
var { asText, src, HTTPError } = require('../components/base')

module.exports = view(page, meta, 'page')

var DEFAULT_TITLE = 'Ngaren'

function page (state, emit) {
  var uid = state.params.page ? state.params.page : 'home'
  var doc = state.pages.find((doc) => doc.uid === uid)
  if (!doc) throw HTTPError(404, 'page not found')

  return html`
    <main class="View-main">
      ${doc.data.body.map((slice, index, list) => slices(slice, index, list, state))}
    </main>
  `
}

function meta (state) {
  var uid = state.params.page ? state.params.page : 'home'
  var doc = state.pages.find((doc) => doc.uid === uid)
  if (!doc) throw HTTPError(404, 'page not found')
  var props = {
    title: uid === 'home' ? DEFAULT_TITLE : asText(doc.data.title),
    description: asText(doc.data.description)
  }

  var image = doc.data.featured_image
  if (image && image.url) {
    Object.assign(props, {
      'og:image': src(image.url, 1200),
      'og:image:width': 1200,
      'og:image:height': 1200 * image.dimensions.height / image.dimensions.width
    })
  }

  return props
}

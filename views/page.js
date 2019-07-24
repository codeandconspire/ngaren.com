var html = require('choo/html')
var view = require('../components/view')
var slices = require('../components/slices')
var { asText, src, HTTPError, metaKey } = require('../components/base')

module.exports = view(page, meta, 'page')

function page (state, emit) {
  var find = state.params.page ? state.params.page : 'home'
  return state.prismic.getByUID('page', find, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return html`<main class="View-main"></main>`

    return html`
      <main class="View-main">
        ${asText(doc.data.title)}
        ${doc.data.body.map((slice, index, list) => slices(slice, index, list, onclick))}
      </main>
    `
  })

  // create link handler, emitting pushState
  // obj -> fn
  function onclick (doc) {
    return function (event) {
      if (metaKey(event)) return
      emit('pushState', event.currentTarget.href)
      event.preventDefault()
    }
  }
}

function meta (state) {
  var find = state.params.page ? state.params.page : 'home'
  return state.prismic.getByUID('page', find, function (err, doc) {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
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
  })
}

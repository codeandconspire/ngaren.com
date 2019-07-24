var html = require('choo/html')
var asElement = require('prismic-element')
var embed = require('../embed')
var serialize = require('../base/serialize')
var { resolve, srcset, src, memo } = require('../base')

module.exports = slices

function slices (slice, index, list, onclick) {
  switch (slice.slice_type) {
    case 'text': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container">
          ${asElement(slice.primary.text, resolve, serialize)}
        </div>
      `
    }
    case 'image': {
      if (!slice.primary.image.url) return null
      var caption = slice.primary.image.alt
      var image = slice.primary.image
      var attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      if (!/\.(svg|gif?)$/.test(image.url)) {
        attrs.sizes = '100vw'
        attrs.srcset = srcset(
          image.url,
          [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
        )
      }

      return html`
        <figure>
          <img ${attrs} src="${src(slice.primary.image.url, 800)}">
          <div class="u-container">
            ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
          </div>
        </figure>
      `
    }
    case 'line': {
      let prev = list[index - 1]
      let next = list[index + 1]
      let narrow = (next && next.slice_type === 'text') && (!prev || prev.slice_type === 'text')
      return html`
        <div class="u-container">
          <hr class="${narrow ? 'u-medium' : ''}">
        </div>
      `
    }
    case 'video': {
      if (slice.primary.video.type !== 'video') return null
      let children = video(slice.primary.video)
      if (!children) return null

      return html`
        <div class="u-md-container">
          ${children}
        </div>
      `
    }
    default: return null
  }
}

// map props to embed player
// obj -> Element
function video (props) {
  var id = embed.id(props)
  if (!id) return null

  var provider = props.provider_name.toLowerCase()
  return embed({
    url: props.embed_url,
    title: props.title,
    src: `/media/${provider}/w_900/${id}`,
    width: props.thumbnail_width,
    height: props.thumbnail_height,
    sizes: '100vw',
    srcset: srcset(id, [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']], { type: provider })
  })
}

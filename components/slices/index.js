var html = require('choo/html')
var asElement = require('prismic-element')
var embed = require('../embed')
var callout = require('../callout')
var serialize = require('../text/serialize')
var { i18n, asText, resolve, srcset, src, memo } = require('../base')

var text = i18n()

module.exports = slices

function slices (slice, index, list, onclick) {
  switch (slice.slice_type) {
    case 'text': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container u-space1">
          <div class="Text">      
            ${asElement(slice.primary.text, resolve, serialize)}
          </div>
        </div>
      `
    }
    case 'image': {
      if (!slice.primary.image.url) return null

      let attrs = memo(function (image) {
        var attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)

        if (!/\.(svg|gif?)$/.test(image.url)) {
          attrs.sizes = '100vw'
          attrs.srcset = srcset(
            image.url,
            [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
          )
        }

        return attrs
      }, [slice.primary.image])

      var caption = slice.primary.image.alt

      return html`
        <figure class="Text u-sizeFull u-space1">
          <div class="u-md-container">
            <div class="u-lg-expand">
              <img ${attrs} src="${src(slice.primary.image.url, 800)}">
              <div class="u-container">
                ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
              </div>
            </div>
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
          <hr class="${narrow ? 'u-medium' : ''} u-space1">
        </div>
      `
    }
    case 'video': {
      if (slice.primary.video.type !== 'video') return null
      let children = video(slice.primary.video)
      if (!children) return null

      return html`
        <div class="u-md-container u-space2">
          <figure class="Text u-sizeFull">
            <div class="u-space1">${children}</div>
          </div>
        </div>
      `
    }
    case 'callout': {
      let link = slice.primary.link
      let title = asText(slice.primary.heading)
      if (!title && link.id) title = asText(link.data.title)
      let body = asText(slice.primary.text)
      if (!text.length && link.id) body = asText(link.data.description)

      let image = slice.primary.image
      if (!image || (!image.url && link.id)) {
        image = link.data.featured_image
        if (!image || !image.url) image = link.data.image
      }

      var action = slice.primary.link_text
      if (!action) {
        if (link.id) action = link.data.cta
        else action = text`Read more`
      }

      let props = {
        title: title,
        body: body,
        theme: slice.primary.theme.toLowerCase(),
        direction: slice.primary.direction.toLowerCase(),
        link: (link.url || link.id) && !link.isBroken ? {
          href: resolve(link),
          onclick: link.id ? onclick(link) : null,
          text: action
        } : null,
        image: memo(function (url, sizes) {
          if (!url) return null
          return {
            src: src(url, 720),
            sizes: '(min-width: 1000px) 35vw, (min-width: 600px) 200px, 100vw',
            srcset: srcset(url, sizes, {
              aspect: 10 / 12,
              transforms: 'c_thumb,g_face'
            }),
            alt: image.alt || '',
            width: image.dimensions.width,
            height: image.dimensions.width * 10 / 12
          }
        }, [image && image.url, [720, 400, 800, 1200]])
      }

      return html`
        <div class="u-container u-space0">${callout(props)}</div>
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

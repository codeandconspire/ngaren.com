var html = require('choo/html')
var asElement = require('prismic-element')
var embed = require('../embed')
var { resolve, srcset, src } = require('../base')

module.exports = slices

function slices (slice, index, list, onclick) {
  switch (slice.slice_type) {
    case 'text': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container">
          <div class="u-padded">
            ${asElement(slice.primary.text, resolve)}
          </div>
        </div>
      `
    }
    case 'hero': {
      if (!slice.primary.text.length || !slice.primary.image.url) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      if (!/\.(svg|gif?)$/.test(image.url)) {
        attrs.sizes = '100vw'
        attrs.srcset = srcset(
          image.url,
          [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
        )
      }
      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Hero">
              <div class="Hero-body">
                ${asElement(slice.primary.text, resolve)}
              </div>
              <figure class="Hero-figure">
                <img ${attrs} src="${src(slice.primary.image.url, 800)}">
              </figure>
            </div>
          </div>
        </div>
      `
    }
    case 'image': {
      if (!slice.primary.image.url) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
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
        </figure>
      `
    }
    case 'line': {
      return html`
        <div class="u-container">
          <hr>
        </div>
      `
    }
    case 'video': {
      return null
      // if (!slice.primary.image.url) return null
      // let image = slice.primary.image
      // let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      // if (!/\.(svg|gif?)$/.test(image.url)) {
      //   attrs.sizes = '100vw'
      //   attrs.srcset = srcset(
      //     image.url,
      //     [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
      //   )
      // }

      // return html`
      //   <div class="u-lg-container">
      //     <div class="u-video">
      //       <img ${attrs} src="${src(slice.primary.image.url, 800)}">
      //       <video preload="metadata" controls disablePictureInPicture playsinline muted width="960" height="540" class="u-video" poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
      //         <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/vc_h265,w_960/v1563978786/trimmed_dhpmkk.mp4" type="video/mp4; codecs=hvc1">
      //         <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/vc_vp9,w_960/v1563978786/trimmed_dhpmkk.webm" type="video/webm; codecs=vp9">
      //         <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/vc_auto,w_960/v1563978786/trimmed_dhpmkk.mp4" type="video/mp4">
      //       </video>
      //     </div>
      //   </div>
      // `
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

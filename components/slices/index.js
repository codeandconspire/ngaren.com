var html = require('choo/html')
var asElement = require('prismic-element')
var embed = require('../embed')
var { resolve, srcset, src } = require('../base')

module.exports = slices
var odd = false
var even = false

function slices (slice, index, list, onclick) {
  switch (slice.slice_type) {
    case 'text': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice">
              ${asElement(slice.primary.text, resolve)}
            </div>
          </div>
        </div>
      `
    }
    case 'hero': {
      if (!slice.primary.text.length || !slice.primary.image.url) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      attrs.sizes = '100vw'
      attrs.srcset = srcset(
        image.url,
        [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
      )
      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--hero">
              <div class="Slice Slice-body">
                ${asElement(slice.primary.text, resolve)}
              </div>
              <div class="Slice-aside">
                <figure class="Slice-figure" style="padding-bottom: ${(image.dimensions.height / image.dimensions.width * 100).toFixed(2)}%;">
                  <img ${attrs} src="${src(slice.primary.image.url, 800)}">
                </figure>
              </div>
            </div>
          </div>
        </div>
      `
    }
    case 'image': {
      if (!slice.primary.image.url) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      attrs.sizes = '100vw'
      attrs.srcset = srcset(
        image.url,
        [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
      )

      return html`
        <div class="Slice Slice--image">
          <figure class="Slice-figure" style="padding-bottom: ${(image.dimensions.height / image.dimensions.width * 100).toFixed(2)}%;">
            <img ${attrs} src="${src(slice.primary.image.url, 800)}">
          </figure>
        </div>
      `
    }
    case 'person': {
      if (!slice.primary.image.url || !slice.primary.text.length) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      attrs.sizes = '100vw'
      attrs.srcset = srcset(
        image.url,
        [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
      )

      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--person ${(odd = !odd) ? '' : 'Slice--alt'}">
              <div class="Slice-aside">
                <figure class="Slice-figure" style="padding-bottom: ${(image.dimensions.height / image.dimensions.width * 100).toFixed(2)}%;">
                  <img ${attrs} src="${src(slice.primary.image.url, 800)}">
                </figure>
              </div>
              <div class="Slice Slice-body">
                ${asElement(slice.primary.text, resolve)}
              </div>
            </div>
          </div>
        </div>
      `
    }
    case 'gallery': {
      if (!slice.items.length) return null
      var images = slice.items.map(function (item) {
        if (!item.image.url) return
        let attrs = Object.assign({ alt: item.image.alt || '' }, item.image.dimensions)
        attrs.sizes = '100vw'
        attrs.srcset = srcset(
          item.image.url,
          [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
        )
        return html`
          <div class="Slice-item">
            <figure class="Slice-figure" style="padding-bottom: ${(item.image.dimensions.height / item.image.dimensions.width * 100).toFixed(2)}%;">
              <img ${attrs} src="${src(item.image.url, 800)}">
            </figure>
          </div>
        `
      })

      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--gallery ${(even = !even) ? '' : 'Slice--alt'}">
              ${images}
            </div>
          </div>
        </div>
      `
    }
    case 'line': {
      return html`
        <div class="u-container">
          <hr>
        </div>
      `
    }
    case 'space': {
      return html`<div class="Slice Slice--space"></div>`
    }
    case 'video': {
      return null
      // if (!slice.primary.image.url) return null
      // let image = slice.primary.image
      // let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      // attrs.sizes = '100vw'
      // attrs.srcset = srcset(
      //   image.url,
      //   [640, 750, 1125, 1440, [2880, 'q_50'], [3840, 'q_50']]
      // )

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

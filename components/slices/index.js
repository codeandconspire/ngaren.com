var html = require('choo/html')
var { srcset, src, asElement, mask } = require('../base')

module.exports = slices
var odd = false
var even = false

function slices (slice, index, list, onclick) {
  switch (slice.slice_type) {
    case 'space': {
      return html`<div class="Slice Slice--space"></div>`
    }
    case 'line': {
      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--divider">
              <hr class="u-hiddenVisually" />
              <svg class="Slice-repeat" preserveAspectRatio="none" style="display: none;" role="presentation" viewBox="0 0 371 88">
                <g fill="none" fill-rule="evenodd">
                  <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M0 44h371"/>
                </g>
              </svg>
              <svg class="Slice-symbol" style="display: none;" role="presentation" viewBox="0 0 365 88">
                <g fill="none" fill-rule="evenodd">
                  <path fill="#fff" d="M.5 0h363.5v88H.5z"/>
                  <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      `
    }
    case 'text': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice">
              ${asElement(slice.primary.text, (doc) => doc.url || '/')}
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
      attrs.srcset = srcset(image.url, [320, 360, 640, 720, 1080, 1300, 1440, 2000, 2600])

      return html`
        <div class="Slice Slice--image">
          <figure class="Slice-figure" style="--aspect: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
            <img style="max-width: 100%; height: auto;" ${attrs} src="${src(slice.primary.image.url, 640)}" />
          </figure>
        </div>
      `
    }
    case 'hero': {
      if (!slice.primary.image.url || !slice.primary.text.length) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      attrs.sizes = '(min-midth: 1000px) 40vw, 98vw'
      attrs.srcset = srcset(image.url, [320, 360, 640, 720, 900, 1080, 1300, 1440, 2000])

      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--hero">
              <div class="Slice Slice-body">
                ${asElement(slice.primary.text, (doc) => doc.url || '/')}
              </div>
              <div class="Slice-aside">
                <figure class="Slice-figure Slice-figure--mask" style="--aspect: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
                  <img style="max-width: 100%; height: auto;" ${attrs} src="${src(slice.primary.image.url, 640)}" />
                  ${mask('Slice-mask')}
                </figure>
              </div>
            </div>
          </div>
        </div>
      `
    }
    case 'person': {
      if (!slice.primary.image.url || !slice.primary.text.length) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      odd = !odd
      attrs.sizes = '(min-midth: 600px) 10vw, 98vw'
      attrs.srcset = srcset(image.url, [320, 360, 640, 720, 900, 1080, 1300, 1440, 2000])

      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--person ${(odd) ? '' : 'Slice--alt'}">
              <div class="Slice-aside">
                <figure class="Slice-figure Slice-figure--mask" style="--aspect: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
                  <img style="max-width: 100%; height: auto;" ${attrs} src="${src(slice.primary.image.url, 640)}" />
                  ${mask('Slice-mask')}
                </figure>
              </div>
              <div class="Slice Slice-body">
                ${asElement(slice.primary.text, (doc) => doc.url || '/')}
              </div>
            </div>
          </div>
        </div>
      `
    }
    case 'gallery': {
      if (!slice.items.length) return null
      even = !even
      var images = slice.items.map(function (item) {
        if (!item.image.url) return
        let attrs = Object.assign({ alt: item.image.alt || '' }, item.image.dimensions)
        let masked = item.masked.toLowerCase() === 'masked'
        attrs.sizes = '(min-midth: 600px) 28vw, 70vw'
        attrs.srcset = srcset(item.image.url, [150, 200, 320, 360, 640, 720, 900, 1080, 1300, 1440])
        return html`
          <div class="Slice-item">
            <figure class="Slice-figure ${masked ? 'Slice-figure--mask' : null}" style="--aspect: ${(item.image.dimensions.height / item.image.dimensions.width * 100).toFixed(2)}%;">
              <img style="max-width: 100%; height: auto;" ${attrs} src="${src(item.image.url, 640)}" />
              ${masked ? mask('Slice-mask') : null}
            </figure>
          </div>
        `
      })

      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--gallery ${(even) ? '' : 'Slice--alt'}">
              ${images}
            </div>
          </div>
        </div>
      `
    }
    case 'video': {
      if (!slice.primary.image.url) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      attrs.sizes = '100vw'
      attrs.srcset = srcset(image.url, [320, 360, 640, 720, 1080, 1300, 1440, 2000, 2600])

      return html`
        <div class="Slice Slice--image Slice--video">
          <figure class="Slice-figure" style="--aspect: ${((720 / 1280) * 100).toFixed(2)}%;">
            <img style="max-width: 100%; height: auto;" ${attrs} src="${src(slice.primary.image.url, 640)}" />
            <video style="max-width: 100%; height: auto;" preload="metadata" controls disablePictureInPicture playsinline muted loop width="960" height="540" poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
              <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/vc_h265,w_960/v1563978786/trimmed_dhpmkk.mp4" type="video/mp4; codecs=hvc1">
              <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/vc_vp9,w_960/v1563978786/trimmed_dhpmkk.webm" type="video/webm; codecs=vp9">
              <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/vc_auto,w_960/v1563978786/trimmed_dhpmkk.mp4" type="video/mp4">
            </video>
          </figure>
        </div>
      `
    }
    default: return null
  }
}

var html = require('choo/html')
var asElement = require('prismic-element')
var { srcset, src, serialize, mask } = require('../base')

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
        <div class="u-container"><div class="Slice--divider"><hr class="u-hiddenVisually" /></div></div>
      `
    }
    case 'text': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice">
              ${asElement(slice.primary.text, false, serialize)}
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
          <figure class="Slice-figure" style="padding-bottom: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
            <img ${attrs} src="${src(slice.primary.image.url, 640)}" />
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
                ${asElement(slice.primary.text, false, serialize)}
              </div>
              <div class="Slice-aside">
                <figure class="Slice-figure Slice-figure--mask" style="padding-bottom: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
                  <img ${attrs} src="${src(slice.primary.image.url, 640)}" />
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
                <figure class="Slice-figure Slice-figure--mask" style="padding-bottom: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
                  <img ${attrs} src="${src(slice.primary.image.url, 640)}" />
                  ${mask('Slice-mask')}
                </figure>
              </div>
              <div class="Slice Slice-body">
                ${asElement(slice.primary.text, false, serialize)}
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
            <figure class="Slice-figure ${masked ? 'Slice-figure--mask' : null}" style="padding-bottom: ${(item.image.dimensions.height / item.image.dimensions.width * 100).toFixed(2)}%;">
              <img ${attrs} src="${src(item.image.url, 640)}" />
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
      return null
    }
    default: return null
  }
}

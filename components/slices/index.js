var html = require('choo/html')
var Component = require('choo/component')
var onintersect = require('on-intersect')
var asElement = require('prismic-element')
var { Elements } = require('prismic-richtext')
var { srcset, src, mask, resolve } = require('../base')
var Loop = require('../loop')
var Video = require('../video')

module.exports = slices
var odd = false
var even = false

class Intersector extends Component {
  constructor (id) {
    super(id)
    this.id = id
  }

  update () {
    return false
  }

  load (el) {
    if ('IntersectionObserver' in window) {
      this.unload = onintersect(el, function (event) {
        event.target.classList.add('is-inview')
      })
    } else {
      el.classList.add('is-inview')
    }
  }

  createElement (render) {
    return render({ id: this.id, class: 'Slice-intersector' })
  }
}

function slices (slice, index, list, state) {
  switch (slice.slice_type) {
    case 'space': {
      return html`<div class="Slice Slice--space" id="slice-${index}"></div>`
    }
    case 'line': {
      return html`
        <div class="u-container" id="slice-${index}">
          <div class="u-padded">
          ${state.cache(Intersector, `line-${index}`).render(function (props) {
            return html`
              <div id="${props.id}" class="${props.class}">
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
            `
          })}

          </div>
        </div>
      `
    }
    case 'text': {
      if (!slice.primary.text.length) return null
      var small = slice.primary.size && slice.primary.size.toLowerCase() === 'small'

      return html`
        <div class="u-container" id="slice-${index}">
          <div class="u-padded">
            <div class="Slice Slice--text ${small ? 'Slice--small' : ''}">
              ${asElement(slice.primary.text, resolve, serializer)}
            </div>
          </div>
        </div>
      `
    }
    case 'heading': {
      if (!slice.primary.text.length) return null
      return html`
        <div class="u-container" id="slice-heading-${index}">
          <div class="u-padded">
            <div class="Slice Slice--heading">
              ${asElement(slice.primary.text, resolve, serializer)}
            </div>
          </div>
        </div>
      `
    }
    case 'image': {
      if (!slice.primary.primary.url) return null
      if (!slice.primary.alternative.url) return null
      let primary = slice.primary.primary
      let alternative = slice.primary.alternative
      let sizes = [320, 360, 640, 720, 1080, 1300, 1440, 2000, 2600]
      let aspectPrimary = ((primary.dimensions.height / primary.dimensions.width) * 100).toFixed(2)
      let aspectAlternative = ((alternative.dimensions.height / alternative.dimensions.width) * 100).toFixed(2)

      return html`
        <div class="Slice Slice--image" id="slice-${index}">
          <figure class="Slice-figure" style="--aspect-primary: ${aspectPrimary}%; --aspect-alternative: ${aspectAlternative}%;">
            <picture>
              <source srcset="${srcset(primary.url, sizes)}" media="(min-width: 500px)" sizes="100vw">
              <img class="Figure-image js-image" alt="${primary.alt || ''}" srcset="${srcset(alternative.url, sizes)}" sizes="100vw" width="${alternative.dimensions.height}" height="${alternative.dimensions.height}" src="${alternative.src}">
            </picture>
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
        <div class="u-container" id="slice-${index}">
          <div class="u-padded">
            <div class="Slice Slice--text Slice--hero">
              <div class="Slice-body" style="--Slice-item-index: 0">
                ${asElement(slice.primary.text, resolve, serializer)}
              </div>
              <div class="Slice-aside" style="--Slice-item-index: 1">
                ${state.cache(Intersector, image.url.split('/').slice(-1)[0]).render(function (props) {
                  return html`
                    <figure id="${props.id}" class="Slice-figure Slice-figure--mask ${props.class}" style="--aspect: 108%;">
                      <img style="max-width: 100%; height: auto;" ${attrs} src="${src(slice.primary.image.url, 640)}" />
                      ${state.cache(Loop, 'hero').render()}
                      ${mask('Slice-mask')}
                    </figure>
                  `
                })}
              </div>
            </div>
          </div>
        </div>
      `
    }
    case 'person': {
      if (!slice.primary.image.url || !slice.primary.text.length) return null
      let image = slice.primary.image
      let img = Object.assign({ alt: image.alt || '' }, image.dimensions)
      odd = !odd
      img.sizes = '(min-midth: 600px) 10vw, 98vw'
      img.srcset = srcset(image.url, [320, 360, 640, 720, 900, 1080, 1300, 1440, 2000])

      return html`
        <div class="u-container" id="slice-${index}">
          <div class="u-padded">
            <div class="Slice Slice--person Slice--small ${(odd) ? '' : 'Slice--alt'}">
              <div class="Slice-aside" style="--Slice-item-index: ${(odd) ? 1 : 0}">
                ${state.cache(Intersector, image.url.split('/').slice(-1)[0]).render(function (props) {
                  return html`
                    <figure id="${props.id}" class="Slice-figure Slice-figure--mask ${props.class}" style="--aspect: ${((image.dimensions.height / image.dimensions.width) * 100).toFixed(2)}%;">
                      <img style="max-width: 100%; height: auto;" ${img} src="${src(slice.primary.image.url, 640)}" />
                      ${mask('Slice-mask')}
                    </figure>
                  `
                })}
              </div>
              <div class="Slice-body" style="--Slice-item-index: ${(odd) ? 0 : 1}">
                ${asElement(slice.primary.text, resolve, serializer)}
              </div>
            </div>
          </div>
        </div>
      `
    }
    case 'gallery': {
      if (!slice.items.length) return null
      even = !even
      var images = slice.items.map(function (item, i) {
        if (!item.image.url) return
        let img = Object.assign({ alt: item.image.alt || '' }, item.image.dimensions)
        let masked = item.masked.toLowerCase() === 'masked'
        img.sizes = '(min-midth: 600px) 28vw, 70vw'
        img.srcset = srcset(item.image.url, [150, 200, 320, 360, 640, 720, 900, 1080, 1300, 1440])
        return state.cache(Intersector, `gallery-${index}-${i}`).render(function (props) {
          return html`
            <div id="${props.id}" class="Slice-item ${props.class}">
              <figure class="Slice-figure ${masked ? 'Slice-figure--mask' : null}" style="--aspect: ${(item.image.dimensions.height / item.image.dimensions.width * 100).toFixed(2)}%;">
                <img style="max-width: 100%; height: auto;" ${img} src="${src(item.image.url, 640)}" />
                ${masked ? mask('Slice-mask') : null}
              </figure>
            </div>
          `
        })
      })

      return html`
        <div class="u-container" id="slice-${index}">
          <div class="u-padded">
            <div class="Slice Slice--gallery ${even ? '' : 'Slice--alt'}">
              ${images}
              ${even ? null : state.cache(Intersector, `gallery-${index}-${slice.items.length + 1}`).render(function (props) {
                return html`<div class="Slice-caption Slice-intersector">Photos courtesy of Turkana Basin Institute</div>`
              })}
            </div>
          </div>
        </div>
      `
    }
    case 'video': {
      if (!slice.primary.image.url || !slice.primary.video) return null
      let image = slice.primary.image
      let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
      attrs.sizes = '100vw'
      attrs.srcset = srcset(image.url, [320, 360, 640, 720, 1080, 1300, 1440, 2000, 2600])

      return html`
        <div class="Slice Slice--image Slice--video" id="slice-${index}">
          <figure class="Slice-figure" style="--aspect-primary: ${((720 / 1280) * 100).toFixed(2)}%;">
            <img style="max-width: 100%; height: auto;" ${attrs} src="${src(slice.primary.image.url, 640)}" />
            ${state.cache(Video, 'promo').render(slice.primary.video)}
          </figure>
        </div>
      `
    }
    default: return null
  }

  function serializer (type, node, content, children, index) {
    if (type === Elements.label ||
      type === Elements.span ||
      type === Elements.strong ||
      type === Elements.listItem ||
      type === Elements.olistItem) {
      return null
    }

    if (type === Elements.em) {
      return html`<span class="u-textNowrap">${content}</span>`
    }

    if (type === Elements.hyperlink) {
      var args = {
        href: node.data.url ? node.data.url : '/' + node.data.slug,
        class: 'u-linkArrow',
        id: `${state.params.page}-${index}`
      }
      var arrow = true

      if (node.data.target === '_blank') {
        args.target = '_blank'
        args.rel = 'noopener noreferrer'
      }

      if (node.data.url && node.data.url.indexOf('mailto') !== -1) {
        args.class = 'u-link'
        arrow = false
      }

      console.log(args.id)

      return html`<a ${args}>
        ${content}
        ${arrow ? html`
          <svg class="u-arrow" style="display: none;" role="presentation" viewBox="0 0 372 88">
            <g fill="none" fill-rule="evenodd">
              <path fill="#FFF" fill-rule="nonzero" d="M.5 0H372v88H.5z"/>
              <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
              <path fill="currentColor" d="M352 27l20 17-20 17z"/>
            </g>
          </svg>
        ` : null}
      </a>`
    }

    var segment = node.text.split(' ').slice(0, 5).join('-').toLowerCase().replace(/[^a-z-]/gi, '')
    var id = `text-${state.params.page}-${index}-${segment}`

    return state.cache(Intersector, id).render(function (props) {
      switch (type) {
        case Elements.heading1: return html`<h1 ${props}>${children}</h1>`
        case Elements.heading2: return html`<h2 ${props}>${children}</h2>`
        case Elements.heading3: return html`<h3 ${props}>${children}</h3>`
        case Elements.paragraph: return html`<p ${props}>${children}</p>`
        case Elements.preformatted: return html`<pre ${props}>${children}</pre>`
        case Elements.list: return html`<ul ${props}>${children}</ul>`
        case Elements.oList: return html`<ol ${props}>${children}</ol>`
        default: return null
      }
    })
  }
}

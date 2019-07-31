var html = require('choo/html')
var raw = require('choo/html/raw')
var { Elements } = require('prismic-richtext')
var PrismicRichText = require('prismic-richtext')
var LinkHelper = require('prismic-helpers').Link

function serialize (linkResolver, type, element, content, children) {
  var attrs = {}
  if (element.label) attrs.class = element.label

  switch (type) {
    case Elements.heading1: return html`<h1 ${attrs}>${children}</h1>`
    case Elements.heading2: return html`<h2 ${attrs}>${children}</h2>`
    case Elements.heading3: return html`<h3 ${attrs}>${children}</h3>`
    case Elements.paragraph: return html`<p ${attrs}>${children}</p>`
    case Elements.preformatted: return html`<pre ${attrs}>${children}</pre>`
    case Elements.strong: return html`<strong ${attrs}>${children}</strong>`
    case Elements.em: return html`<span class="u-textNowrap">${content}</span>`
    case Elements.listItem:
    case Elements.oListItem: return html`<li ${attrs}>${children}</li>`
    case Elements.list: return html`<ul ${attrs}>${children}</ul>`
    case Elements.oList: return html`<ol ${attrs}>${children}</ol>`
    case Elements.hyperlink: return serializeHyperlink(linkResolver, element, children)
    case Elements.label: return serializeLabel(element, children)
    case Elements.span: return serializeSpan(content)
    default: return null
  }
}

function serializeHyperlink (linkResolver, element, children) {
  var href = LinkHelper.url(element.data, linkResolver)
  if (element.data.target && element.data.target === '_blank') {
    return html`<a href="${href}" target="_blank" rel="noopener noreferrer">${children}</a>`
  }
  return html`<a href="${LinkHelper.url(element.data, linkResolver)}">${children}</a>`
}

function serializeLabel (element, children) {
  var attrs = {}
  if (element.data.label) attrs.class = element.data.label
  return html`<span ${attrs}>${children}</span>`
}

function serializeSpan (content) {
  if (content && content.indexOf('\n') !== -1) {
    return raw(content.replace(/\n/g, '<br />'))
  }
  return content
}

exports.asElement = asElement
function asElement (richText, linkResolver, serializer) {
  var element = PrismicRichText.serialize(richText, serialize.bind(null, linkResolver), serializer)

  if (element.length === 1) {
    return element[0]
  }

  return element
}

exports.mask = mask
function mask (className) {
  return html`
    <svg class="${className}" role="presentation" style="display: none;" preserveAspectRatio="none" viewBox="0 0 365 88">
      <g fill="none" fill-rule="evenodd">
      <path fill="#FFF" d="M123 44V5l121 78V44h121v44H0V44z"/>
        <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
      </g>
    </svg>
  `
}

// detect if meta key was pressed on event
// obj -> bool
exports.metaKey = metaKey
function metaKey (e) {
  if (e.button && e.button !== 0) return true
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
}

// compose src attribute from url for a given size
// (str, num, obj?) -> str
exports.src = src
function src (uri, size) {
  var q = (size > 1000) ? 'q_25' : 'q_40'
  var transforms = `c_fill,f_auto,${q}`

  // trim prismic domain from uri
  var parts = uri.split('ngaren.cdn.prismic.io/ngaren/')
  uri = parts[parts.length - 1]

  return `/media/fetch/${transforms ? transforms + ',' : ''}w_${size}/${uri}`
}

// compose srcset attribute from url for given sizes
// (str, arr, obj?) -> str
exports.srcset = srcset
function srcset (uri, sizes) {
  return sizes.map(function (size) {
    return `${src(uri, size)} ${size}w`
  }).join(',')
}

// nullable text getter for Prismic text fields
// (arr?) -> str
exports.asText = asText
function asText (richtext) {
  if (!richtext || !richtext.length) return null
  var text = ''
  for (let i = 0, len = richtext.length; i < len; i++) {
    text += (i > 0 ? ' ' : '') + richtext[i].text
  }
  return text
}

// custom error with HTTP status code
// (num, Error?) -> HTTPError
exports.HTTPError = HTTPError
function HTTPError (status, err) {
  if (!(this instanceof HTTPError)) return new HTTPError(status, err)
  if (!err || typeof err === 'string') err = new Error(err)
  err.status = status
  Object.setPrototypeOf(err, Object.getPrototypeOf(this))
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, HTTPError)
  }
  return err
}

HTTPError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(HTTPError, Error)
} else {
  HTTPError.__proto__ = Error // eslint-disable-line no-proto
}

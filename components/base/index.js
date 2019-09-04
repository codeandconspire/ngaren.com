var html = require('choo/html')

exports.resolve = resolve
function resolve (doc) {
  if (doc.url) return doc.url
  if (doc.uid) return `/${doc.uid}`
  return '/'
}

exports.mask = mask
function mask (className) {
  return html`
    <div class="${className}">
    <svg role="presentation" style="display: none;" preserveAspectRatio="none" viewBox="0 0 365 88">
      <g fill="none" fill-rule="evenodd">
      <path fill="#FFF" d="M123 44V5l121 78V44h121v44H0V44z"/>
        <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
      </g>
    </svg>
  `
}

// compose src attribute from url for a given size
// (str, num, obj?) -> str
exports.src = src
function src (uri, size) {
  var q = (size > 1000) ? 'q_45' : 'q_65'
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

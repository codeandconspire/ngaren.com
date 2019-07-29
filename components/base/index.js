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
  var q = (size > 1000) ? 'q_22' : 'q_30'
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

var choo = require('choo')
// var middleware = require('./lib/prismic-middleware')
var app = choo()

var REPOSITORY = 'https://ngaren.cdn.prismic.io/api/v2'

app.state.origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : process.env.npm_package_now_alias

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('./stores/tracking'))
app.use(require('./stores/navigation'))
app.use(require('./stores/prismic')({ repository: REPOSITORY }))
app.use(require('choo-meta')({ origin: app.state.origin }))
app.use(require('choo-service-worker')('/sw.js'))
app.use(require('./stores/prefetch'))

app.route('/:page', require('./views/page'))
app.route('/', require('./views/page'))

try {
  module.exports = app.mount('body')
  // remove parse guard added in header
  window.onerror = null
} catch (err) { }

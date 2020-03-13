var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')
var { resolve } = require('../components/base')

var REPOSITORY = 'https://ngaren.cdn.prismic.io/api/v2'

module.exports = purge

function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  cccpurge(require('../index'), {
    urls: urls,
    resolve: resolveRoute,
    root: `https://${process.env.HOST}`,
    zone: process.env.CLOUDFLARE_ZONE,
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY
  }, callback)
}

async function resolveRoute (route, done) {
  switch (route) {
    case '/:page': {
      try {
        const api = await Prismic.getApi(REPOSITORY)
        const predicate = Prismic.Predicates.at('document.type', 'page')
        const response = await api.query(predicate)
        done(null, response.results.map(resolve))
      } catch (err) {
        done(err)
      }
      break
    }
    default: done(null)
  }
}

var Prismic = require('prismic-javascript')
var { resolve } = require('../components/base')

var REPOSITORY = 'https://ngaren.cdn.prismic.io/api/v2'

module.exports = resolveRoute

async function resolveRoute (route, done) {
  try {
    let api = await Prismic.getApi(REPOSITORY)
    if (route === '/*') {
      let urls = []
      let queries = [
        Prismic.Predicates.at('document.type', 'page')
      ]
      await Promise.all(queries.map(function (query) {
        var opts = { page: 1, pageSize: 100 }
        return api.query(query, opts).then(function (response) {
          response.results.forEach((doc) => urls.push(resolve(doc)))

          if (response.total_pages > 1) {
            let pages = []
            for (let i = 2; i <= response.total_pages; i++) {
              let page = Object.assign({}, opts, { page: i })
              pages.push(api.query(query, page).then(function (response) {
                response.results.forEach((doc) => urls.push(resolve(doc)))
              }))
            }

            return Promise.all(pages)
          }
        })
      }))
      done(null, urls)
    } else {
      done(null)
    }
  } catch (err) {
    done(err)
  }
}

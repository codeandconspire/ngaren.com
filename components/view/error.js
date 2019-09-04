var html = require('choo/html')

var DEBUG = process.env.NODE_ENV === 'development'
if (typeof window !== 'undefined') {
  try {
    let flag = window.localStorage.DEBUG
    DEBUG = DEBUG || (flag && JSON.parse(flag))
  } catch (err) {}
}

module.exports = error

function error (err, state, emit) {
  return html`
    <main class="View-main">
        <div class="u-container">
          <div class="u-padded">
            <div class="Slice Slice--text">
              ${message(err.status)}
              ${DEBUG ? html`<pre>${err.stack}</pre>` : null}
            </div>
          </div>
        </div>
    </main>
  `
}

function message (status) {
  switch (status) {
    case 404: return html`<div><p>There is no page at this address. Try finding your way using the menu or from ${html`<a href="/">the homepage</a>`}</p></div>`
    case 503: return html`<div><p>You seem to be offline. Check your network connection.</p></div>`
    default: return html`<div><p>We apologize, an error has occured on our site.</p></div>`
  }
}

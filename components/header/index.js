var html = require('choo/html')

module.exports = header

function header (props) {
  return html`
    <header class="header">
      Header!
    </header>
  `
}

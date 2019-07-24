var html = require('choo/html')

module.exports = header

function header (props) {
  return html`
    <header class="Header">
      <ul>
        <li><a href="/">Start</a></li>
        <li><a href="/donate">Donate</a></li>
      </ul>
    </header>
  `
}

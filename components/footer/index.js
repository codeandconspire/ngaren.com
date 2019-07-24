var html = require('choo/html')

module.exports = footer

function footer (props) {
  return html`
    <footer class="Footer>
      <span class="Footer-copy">© ${(new Date()).getFullYear()} Ngaren</span>
    </footer>
  `
}

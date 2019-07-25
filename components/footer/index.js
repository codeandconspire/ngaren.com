var html = require('choo/html')

module.exports = footer

function footer (props) {
  return html`
    <footer class="Footer">
      <nav class="Footer-wrap">
        <ul class="Footer-nav">
          <li><a href="/about" class="Footer-link">About</a></li>
          <li><a href="/donate" class="Footer-link">Donate</a></li>
          <li><a href="/contact" class="Footer-link">Contact</a></li>
          <li class="Footer-start"><a href="/" class="Footer-link">© ${(new Date()).getFullYear()} Ngaren</a></li>
        </ul>
      </nav>
    </footer>
  `
}

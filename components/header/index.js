var html = require('choo/html')

module.exports = header

function header (props) {
  return html`
    <header class="Header">
      <a href="/" class="Header-start">
        <svg role="presentation" class="Header-icon" viewBox="0 0 184 50">
          <path d="M0 25h58V3l64 44V25h62" stroke="#000" stroke-width="5" fill="none" fill-rule="evenodd" stroke-linejoin="round"/>
        </svg>
        Ngaren
      </a>
      <nav class="Header-wrap">
        <ul class="Header-nav">
          <li><a href="/about" class="Header-link">About</a></li>
          <li><a href="/donate" class="Header-link">Donate</a></li>
          <li><a href="/contact" class="Header-link">Contact</a></li>
        </ul>
      </nav>
    </header>
  `
}

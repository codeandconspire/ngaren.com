var html = require('choo/html')

module.exports = header

function header (props) {
  return html`
    <header class="Header">
      <svg class="Header-repeat" preserveAspectRatio="none" style="display: none;" role="presentation" viewBox="0 0 371 88">
        <g fill="none" fill-rule="evenodd">
          <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M0 44h371"/>
        </g>
      </svg>
      <a href="/" class="Header-start">
        <svg class="Header-symbol" role="presentation" viewBox="0 0 365 88">
          <g fill="none" fill-rule="evenodd">
            <path fill="#fff" d="M.5 0h363.5v88H.5z"/>
            <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
          </g>
        </svg>
        <div class="Header-logotype">
          <span>N</span><span>g</span><span>a</span><span>r</span><span>e</span><span>n</span>
        </div>
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

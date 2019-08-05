var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Video extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
    this.route = 'home'
  }

  load (element) {

  }

  update (route = 'home') {
    return route !== this.route
  }

  createElement (route = 'home') {
    this.route = route

    return html`
      <header class="Header" id="${this.id}">
        <div class="u-container">
          <svg class="Header-repeat" preserveAspectRatio="none" style="display: none;" role="presentation" viewBox="0 0 371 88">
            <g fill="none" fill-rule="evenodd">
              <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M0 44h371"/>
            </g>
          </svg>
          <a href="/" class="Header-start ${route === 'home' ? 'is-active' : ''}">
            <svg class="Header-symbol" role="presentation" viewBox="0 0 365 88">
              <g fill="none" fill-rule="evenodd">
                <path fill="#fff" d="M122 0h122v88H122z"/>
                <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
              </g>
            </svg>
            <div class="Header-logotype">
              <span>N</span><span>g</span><span>a</span><span>r</span><span>e</span><span>n</span>
            </div>
          </a>
        </div>
        <nav class="Header-wrap u-container">
          <ul class="Header-nav">
            <li>
              <a href="/about" class="Header-link ${route === 'about' ? 'is-active' : ''}">
                <svg class="Header-symbol" style="display: none;" role="presentation" viewBox="0 0 365 88">
                  <g fill="none" fill-rule="evenodd">
                    <path fill="#fff" d="M122 0h122v88H122z"/>
                    <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
                  </g>
                </svg>
                About
              </a>
            </li>
            <li>
              <a href="/donate" class="Header-link ${route === 'donate' ? 'is-active' : ''}">
                <svg class="Header-symbol" style="display: none;" role="presentation" viewBox="0 0 365 88">
                  <g fill="none" fill-rule="evenodd">
                    <path fill="#fff" d="M122 0h122v88H122z"/>
                    <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
                  </g>
                </svg>
                Donate
              </a>
            </li>
            <li>
              <a href="/contact" class="Header-link ${route === 'contact' ? 'is-active' : ''}">
                <svg class="Header-symbol" style="display: none;" role="presentation" viewBox="0 0 365 88">
                  <g fill="none" fill-rule="evenodd">
                    <path fill="#fff" d="M122 0h122v88H122z"/>
                    <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M5 44h118V5l121 78V44h116"/>
                  </g>
                </svg>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
    `
  }
}

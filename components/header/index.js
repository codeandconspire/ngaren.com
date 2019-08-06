var html = require('choo/html')
var Component = require('choo/component')

var FLAT = 'M0 44L118 44 118 43.9632721 239 44.0642853 239 44 355 44'
var CURVED = 'M0 44L118 44 118 5 239 83 239 44 355 44'

module.exports = class Video extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
    this.route = null
  }

  load (element) {

  }

  update (route = 'home') {
    return route !== this.route
  }

  createElement (route = 'home') {
    var prev = this.route
    this.route = route

    return html`
      <header class="Header" id="${this.id}">
        <div class="u-container">
          <svg class="Header-repeat" preserveAspectRatio="none" style="display: none;" role="presentation" viewBox="0 0 371 88">
            <g fill="none" fill-rule="evenodd">
              <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="M0 44h371"/>
            </g>
          </svg>
          ${link({ href: '/', route: 'home', modifier: 'start' }, html`
            <svg class="Header-symbol Header-symbol--decorative" role="presentation" viewBox="0 0 365 88">
              <g fill="none" fill-rule="evenodd">
                <path fill="#fff" d="M122 0h122v88H122z"/>
                <path vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="${CURVED}"/>
              </g>
            </svg>
            <div class="Header-label Header-label--logotype">
              <span>N</span><span>g</span><span>a</span><span>r</span><span>e</span><span>n</span>
            </div>
          `)}
        </div>
        <nav class="Header-wrap u-container">
          <ul class="Header-nav">
            <li>
              ${link({ href: '/about', route: 'about' }, html`<span class="Header-label">About</span>`)}
            </li>
            <li>
              ${link({ href: '/donate', route: 'donate' }, html`<span class="Header-label">Donate</span>`)}
            </li>
            <li>
              ${link({ href: '/contact', route: 'contact' }, html`<span class="Header-label">Contact</span>`)}
            </li>
          </ul>
        </nav>
      </header>
    `

    function link (props, children) {
      var animation, direction
      if (props.route === route) {
        animation = [FLAT, CURVED]
        direction = 'expanding'
      } else if (props.route === prev) {
        animation = [CURVED, FLAT]
        direction = 'collapsing'
      }

      return html`
        <a href="${props.href}" class="Header-link ${props.modifier ? `Header-link--${props.modifier}` : ''} ${route === props.route ? 'is-active' : ''}">
          ${animation ? html`
            <svg id="header-${props.route}-${direction}" class="Header-symbol" role="presentation" viewBox="0 0 365 88">
              <g fill="none" fill-rule="evenodd">
                <path fill="#fff" d="M122 0h122v88H122z"/>
                <path id="header-${props.route}" vector-effect="non-scaling-stroke" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="10" d="${animation[0]}"/>
                <animate xlink:href="#header-${props.route}" attributeName="d" begin="0s" dur="400ms" calcMode="spline" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="1" fill="freeze" values="${animation.join(';')}" />
              </g>
            </svg>
          ` : null}
          ${children}
        </a>
      `
    }
  }
}

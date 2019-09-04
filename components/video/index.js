/* global YT */

var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Loop extends Component {
  load (element) {

  }

  update () {
    return false
  }

  createElement (videoId) {
    return html`
      <div>
        <div class="Slice-embed" id="player"></div>
        <a href="https://www.youtube.com/watch?v=${videoId}" onclick=${onclick} rel="noopener noreferrer" target="_blank" class="Slice-playLink">
          <svg style="display: none;" class="Slice-play" viewBox="0 0 275 293">
            <path vector-effect="non-scaling-stroke" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linejoin="round" stroke-width="10" d="M35 5l235 141.5L35 288v-95H5l60-93H35z"/>
          </svg>
        </a>
      </div>
    `

    function onclick (event) {
      var tag = document.createElement('script')

      tag.src = 'https://www.youtube.com/iframe_api'
      var firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      var player
      window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('player', {
          height: '720',
          width: '1280',
          modestbranding: 1,
          playsinline: 1,
          videoId: videoId,
          events: {
            'onReady': onPlayerReady
            // 'onStateChange': onPlayerStateChange
          }
        })
      }

      function onPlayerReady (event) {
        event.target.playVideo()
      }

      // var done = false
      // function onPlayerStateChange (event) {
      //   if (event.data === YT.PlayerState.PLAYING && !done) {
      //     setTimeout(stopVideo, 6000)
      //     done = true
      //   }
      // }
      // function stopVideo () {
      //   player.stopVideo()
      // }
      event.preventDefault()
    }
  }
}

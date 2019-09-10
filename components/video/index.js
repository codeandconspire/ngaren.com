var html = require('choo/html')
var Component = require('choo/component')
var Vimeo = require('@vimeo/player')

module.exports = class Loop extends Component {
  update () {
    return false
  }

  createElement (videoId) {
    var loaded = false
    var player, playing, total

    return html`
      <div class="Slice-vimeo">
        <div class="Slice-embed">
          <div id="player"></div>
        </div>
        <a href="https://vimeo.com/${videoId}" onclick=${onclick} rel="noopener noreferrer" target="_blank" class="Slice-playLink">
          <div class="Slice-videoActions">
            <svg style="display: none;" class="Slice-play" viewBox="0 0 275 293">
              <path vector-effect="non-scaling-stroke" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linejoin="round" stroke-width="10" d="M35 5l235 141.5L35 288v-95H5l60-93H35z"/>
            </svg>
            <svg style="display: none;" class="Slice-play Slice-play--loading" viewBox="0 0 257 257">
              <path vector-effect="non-scaling-stroke" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-width="10" d="M128.5 252c68.207167 0 123.5-55.292833 123.5-123.5 0-33.802385-13.580117-64.4329637-35.582158-86.7335431C194.023699 19.0684561 162.904782 5 128.5 5 60.2928334 5 5 60.2928334 5 128.5c0 20.272813 4.88468854 39.404747 13.5413155 56.28305"/>
            </svg>
          </div>
          <span class="Slice-status"></span>
        </a>
      </div>
    `

    function onclick (event) {
      var element = document.querySelector('.Slice-vimeo')
      if (!loaded) {
        element.classList.add('is-loading')
        loaded = true

        player = new Vimeo('player', {
          byline: false,
          portrait: false,
          title: false,
          speed: true,
          transparent: false,
          id: videoId,
          width: 1280,
          height: 720,
          loop: false,
          autoplay: false,
          muted: false,
          gesture: 'media',
          playsinline: true
        })

        player.on('loaded', function () {
          player.play()
          player.getDuration().then(function (duration) {
            total = duration
          }).catch(function (error) {
            console.log(error)
          })
        })

        player.on('play', function () {
          element.classList.remove('is-loading')
          element.classList.add('is-ready')
          element.classList.add('is-playing')
          playing = true
        })

        var timestamp = function (time) {
          var seconds = Math.floor((time / 1000) % 60)
          var minutes = Math.floor((time / 1000 / 60) % 60)
          var duration = []
          duration.push(minutes < 10 ? `0${minutes}` : `${minutes}`)
          duration.push(seconds < 10 ? `0${seconds}` : `${seconds}`)
          return duration.join(':')
        }

        player.on('pause', function () {
          player.getCurrentTime().then(function (seconds) {
            element.querySelector('.Slice-status').innerText = `${timestamp(seconds * 1000)} / ${timestamp(total * 1000)}`
          }).catch(function (error) {
            console.log(error)
          })
          element.classList.remove('is-playing')
          playing = false
        })

        // // Seeking
        // var currentTime = player.media.currentTime
        // Object.defineProperty(player.media, 'currentTime', {
        //     get() {
        //       return currentTime;
        //     },
        //     set(time) {
        //         // Vimeo will automatically play on seek if the video hasn't been played before

        //         // Get current paused state and volume etc
        //         const { embed, media, paused, volume } = player;
        //         const restorePause = paused && !embed.hasPlayed;

        //         // Set seeking state and trigger event
        //         media.seeking = true;
        //         triggerEvent.call(player, media, 'seeking');

        //         // If paused, mute until seek is complete
        //         Promise.resolve(restorePause && embed.setVolume(0))
        //             // Seek
        //             .then(() => embed.setCurrentTime(time))
        //             // Restore paused
        //             .then(() => restorePause && embed.pause())
        //             // Restore volume
        //             .then(() => restorePause && embed.setVolume(volume))
        //             .catch(() => {
        //                 // Do nothing
        //             });
        //     },
        // });
      } else {
        if (playing) {
          player.pause()
        } else {
          player.play()
        }
      }
      event.preventDefault()
    }
  }
}

var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Video extends Component {
  load (element) {
    var playPromise = element.play() || Promise.reject(new Error(`Can't play`))
    playPromise.then(function () {
      // Video could be autoplayed, do nothing.
    }).catch(function (err) {
      console.log(err)
      // Video couldn't be autoplayed because of autoplay policy. Mute it and play.
      element.muted = true
      element.play()
    })

    element.addEventListener('play', function () {
      element.classList.add('is-ready')
    }, false)
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <video class="Video" playsinline autoplay muted loop style="max-width: 100%; height: auto;" disablePictureInPicture width="960" height="540" poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
        <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--9JroGugU--/so_17,vc_auto,w_500,h_540,c_fill,g_center/v1563978786/trimmed_dhpmkk.mp4" type="video/mp4">
      </video>
    `
  }
}

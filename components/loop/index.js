var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Loop extends Component {
  load (element) {
    var playPromise = element.play() || Promise.reject(new Error(`Can't play`))
    playPromise.then(function () {
      // Video could be autoplayed, do nothing.
    }).catch(function (err) {
      if (process.env.NODE_ENV === 'development') console.log(err)
      // Video couldn't be autoplayed because of autoplay policy. Mute it and play.
      element.muted = true
      element.play()
    }).catch(Function.prototype)

    element.addEventListener('play', function () {
      element.classList.add('is-ready')
    }, false)
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <video class="Loop" playsinline autoplay muted loop style="pointer-events: none; max-width: 100%; height: auto;" disablePictureInPicture width="960" height="540" poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
        <source src="https://res.cloudinary.com/dykmd8idd/video/upload/s--CW2nBES4--/so_1,vc_auto/v1568710817/190807_Ngaren_Homepage_Crop-1_cduxwp.mp4" type="video/mp4">
      </video>
    `
  }
}

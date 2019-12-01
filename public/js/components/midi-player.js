export function registerComponent() {
  if (AFRAME.components["midi-player"] === undefined) {
    AFRAME.registerComponent('midi-player', {
      schema: {
        soundfont: { default: 'acoustic_grand_piano' },
        song: { default: '' },
      },
      init: function() {
        let song = this.data.song;
        Soundfont.instrument(new AudioContext(), this.data.soundfont).then(function (piano) {
          piano.schedule(piano.currentTime, [
            { note: 'c2', time: 0, gain: 0.9 },
            { note: 'e2', time: 0.25, gain: 0.7 },
            { note: 'g2', time: 0.5, gain: 0.5 },
            { note: 'c3', time: 0.75, gain: 0.3 }
          ])
        })
      },
    })
  }
}

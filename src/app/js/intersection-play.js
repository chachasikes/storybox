// AFRAME.registerComponent('foo', {
//   init: function() {
//     this.el.addEventListener('hit', (e) => {
//       console.log(e)
//     })
//     this.el.addEventListener('hitend', (e) => {
//       console.log('hitend')
//       console.log(e)
//     })
//   }
// });


AFRAME.registerComponent('intersection-play', {
  schema: {
    name: {default: 'intersection-play-element'},
    sceneTarget: {default: null},
    action: {default: null},
  },
  init: function() {
    console.log('intersection-play init', this.el.getAttribute('id'));
    this.el.addEventListener('hit', (e) => {
      console.log('hit');
      // console.log(e);
    });
    this.el.addEventListener('hitend', (e) => {
      // console.log('hitend');
      // console.log(e);
    });
  },
  update: function() {
    // console.log('intersection-play update', this.el.getAttribute('id'));
    // var data = this.data;
    // var el = this.el;
    //
    // // Remove event listener.
    // if (data.event) {
    //   el.removeEventListener(data.event, this.eventHandlerFn);
    // }
    // this.el.addEventListener('hit', (e) => {
    //   console.log('hit');
    //   console.log(e);
    //
    // })
    // this.el.addEventListener('hitend', (e) => {
    //   console.log('hitend')
    //   console.log(e)
    // })
  },
  remove: function() {
    console.log('remove intersection-play');
    var data = this.data;
    var el = this.el;

    // Remove event listener.
    if (data.event) {
      el.removeEventListener(data.event, this.eventHandlerFn);
    }
  },

})

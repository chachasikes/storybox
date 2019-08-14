AFRAME.registerComponent('intersection-play', {
  // schema: {
  //   name: {default: null},
  //   sceneTarget: {default: null},
  //   action: {default: null},
  // },
  init: function() {
    this.el.addEventListener('hit', (e) => {
      console.log('hit');
      console.log(e);

    })
    this.el.addEventListener('hitend', (e) => {
      console.log('hitend')
      console.log(e)
    })
  }
})

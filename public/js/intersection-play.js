AFRAME.registerComponent('foo', {
  schema: {
    name: {default: null},
  },
  init: function() {

    this.el.addEventListener('hit', (e) => {
console.log(   this.data);
      // console.log(this.el.getAttribute('id'));
    })
    this.el.addEventListener('hitend', (e) => {
      //console.log('hitend')
      //console.log(e)
    })
  }
})


AFRAME.registerComponent('intersection-play', {
  schema: {
    name: {default: 'intersection-play-element'},
    sceneTarget: {default: null},
    action: {default: null},
  },
  init: function() {
    this.el.addEventListener('hit', (e) => {
      console.log('hit');
      console.log(e);

    })
    this.el.addEventListener('hitend', (e) => {
      console.log('hitend')
      console.log(e)
    })
  },
  update: function() {
    var data = this.data;
    var el = this.el;

    // Remove event listener.
    if (data.event) {
      el.removeEventListener(data.event, this.eventHandlerFn);
    }
    this.el.addEventListener('hit', (e) => {
      console.log('hit');
      console.log(e);

    })
    this.el.addEventListener('hitend', (e) => {
      console.log('hitend')
      console.log(e)
    })
  },
  remove: function() {
    var data = this.data;
    var el = this.el;

    // Remove event listener.
    if (data.event) {
      el.removeEventListener(data.event, this.eventHandlerFn);
    }
  },

})

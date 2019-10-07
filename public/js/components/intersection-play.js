export function registerComponent() {
    if (AFRAME.components["intersection-play"] === undefined) {
  AFRAME.registerComponent('intersection-play', {
    schema: {
      name: {default: 'intersection-play-element'},
      sceneTarget: {default: null},
      action: {default: null},
    },
    init: function() {
      this.el.addEventListener('hit', (e) => {
        window.StoryBoxBuilder.hitEvent();

        // console.log('hit');
        // console.log(e);
        // vrlog('hit');
      });
      this.el.addEventListener('hitend', (e, target) => {
        console.log('hitend');
        console.log(e, target);
        // vrlog('hitend');
      });
    },
    update: function() {

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

  });
}
}

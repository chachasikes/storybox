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
      this.el.addEventListener('hitend', (e) => {
        console.log('hitend');
        console.log(e.detail.el);
        if (e.detail !== undefined && e.detail.el !== undefined) {
        let id = e.detail.el.getAttribute('id');
        let intersectAction = e.detail.el.getAttribute('intersect-action');
        let sceneTarget = e.detail.el.getAttribute('scene-target');
        //
        // //@TODO get head position
        //
        console.log(id, intersectAction, sceneTarget); // ,
      }
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

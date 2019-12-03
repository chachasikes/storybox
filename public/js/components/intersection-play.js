import { vrlog } from "./../utilities/vrlog.js";

export function registerComponent() {
  if (AFRAME.components["intersection-play"] === undefined) {
    AFRAME.registerComponent("intersection-play", {
      schema: {
        name: { default: "intersection-play-element" },
        intersectTarget: { default: null },
        action: { default: null }
      },
      init: function() {
        this.el.addEventListener("hit", e => {
          window.StoryboxNavigator.hitEvent();
          // console.log('hit');
          // console.log(e);
          // vrlog('hit');
        });


        window.StoryboxNavigator.sceneEvents.map(events => {
          let sceneSelector = document.querySelector('#scene-selector');
          // console.log('event set up', events);
          if (events.length > 0) {
          events.map(item => {
            if (item.type === 'intersection-play') {
              let intersectTargetEl = document.getElementById(
                `${item.id}-gltf`
              );
              intersectTargetEl.addEventListener(`${item.id}-${item.eventName}`, (e) => {
                // console.log('trying to fade', e);
              });
              // intersectTargetEl.addEventListener(`fade`, (e) => {
              //   console.log('trying to fade', e);
              // });

            }
          })
        }
        })


        this.el.addEventListener("hit", e => {
            // console.log("hitend");
          if (e.detail !== undefined && e.detail.el !== undefined) {
            let id = e.detail.el.getAttribute("id");
            let intersectAction = e.detail.el.getAttribute("intersect-action");
            let intersectTarget = e.detail.el.getAttribute("intersect-target");
            let sceneSelector = document.querySelector('#scene-selector');

            //@TODO get head position
            if (intersectAction === "fadeInObject") {
              // console.log("head to fadeInObject");
              let intersectTargetEl = document.getElementById(
                `${intersectTarget}-gltf`
              );
              if (intersectTargetEl !== undefined) {
                // console.log(intersectTargetEl, `${intersectTarget}-${intersectAction}`);
                intersectTargetEl.emit(`${intersectTarget}-${intersectAction}`);
                // intersectTargetEl.emit(`fade`);
              }
            }
          }
          // vrlog("hit");
        });
      },
      update: function() {},
      remove: function() {
        // console.log("remove intersection-play");
        var data = this.data;
        var el = this.el;

        // Remove event listener.
        if (data.event) {
          el.removeEventListener(data.event, this.eventHandlerFn);
        }
      }
    });
  }
}

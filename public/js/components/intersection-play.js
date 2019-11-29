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
          console.log('event set up', events);
          events.map(item => {
            if (item.type === 'intersection-play') {
              let intersectTargetEl = document.getElementById(
                `${item.id}-gltf`
              );
              intersectTargetEl.addEventListener('fade', () => {
                console.log('trying to fade');
              })

            }
          })
        })


        this.el.addEventListener("hitend", e => {
          console.log("hitend");
          // if (e.detail !== undefined && e.detail.el !== undefined) {
            let id = e.detail.el.getAttribute("id");
            let intersectAction = e.detail.el.getAttribute("intersect-action");
            let intersectTarget = e.detail.el.getAttribute("intersect-target");
            let sceneSelector = document.querySelector('#scene-selector');



            // sceneSelector.addEventListener(`${intersectTarget}-${intersectAction}`, e => {
            //   let intersectTargetEl = document.getElementById(
            //     `${intersectTarget}-gltf`
            //   );
            //   switch(intersectAction) {
            //     case 'fadeInObject':
            //       console.log('fade in object', intersectTarget);
            //       // Trigger a-animation;
            //       // intersectTargetEl.emit(`${intersectTarget}-${intersectAction}`);
            //       break;
            //     case 'fadeInAndPlay':
            //       break;
            //     default:
            //       break;
            //   }
            // });
//
            // //@TODO get head position
            //
            // console.log(id, intersectAction, intersectTarget); // ,
            if (intersectAction === "fadeInObject") {
              let intersectTargetEl = document.getElementById(
                `${intersectTarget}-gltf`
              );
              // console.log(`${intersectTarget}-gltf`);
              if (intersectTargetEl !== undefined) {
                console.log(intersectTargetEl);
                intersectTargetEl.emit('fade');
            //     // intersectTargetEl.setAttribute("gltf-model-opacity", "1");
            //     // intersectTargetEl.dispatchEvent(`${id}-${intersectAction}`);
            //
            //     // this.dispatchEvent(new CustomEvent(`${intersectTarget}-${intersectAction}`, { bubbles: true, detail: { text: () => `${intersectAction} ${intersectTarget}` } }))
            //     // intersectTargetEl.dispatchEvent(window.StoryboxNavigator.sceneEventHandlers.fade);
              }
            //
            }
          // }
          vrlog("hitend");
        });
      },
      update: function() {},
      remove: function() {
        console.log("remove intersection-play");
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

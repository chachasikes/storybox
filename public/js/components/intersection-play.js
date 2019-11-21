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
        this.el.addEventListener("hitend", e => {
          // console.log("hitend");
          if (e.detail !== undefined && e.detail.el !== undefined) {
            let id = e.detail.el.getAttribute("id");
            let intersectAction = e.detail.el.getAttribute("intersect-action");
            let intersectTarget = e.detail.el.getAttribute("intersect-target");
            //
            // //@TODO get head position
            //
            console.log(id, intersectAction, intersectTarget); // ,
            if (intersectAction === "fadeInObject") {
              let intersectTargetEl = document.getElementById(
                `${intersectTarget}-gltf`
              );
              console.log(`${intersectTarget}-gltf`);
              if (intersectTargetEl !== undefined) {
                console.log(intersectTargetEl);
                intersectTargetEl.setAttribute("gltf-model-opacity", "1");
              }
            }
          }
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

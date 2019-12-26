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
        });

        window.StoryboxNavigator.sceneEvents.map(events => {
          let sceneSelector = document.querySelector('#scene-selector');
          if (events.length > 0) {
            events.map(item => {
              if (item.type === 'intersection-play') {
                let intersectTargetEl = document.getElementById(
                  `${item.id}-gltf`
                );
                intersectTargetEl.addEventListener(`${item.id}-${item.eventName}`, (e) => {
                  // console.log('intersect event listener', e);
                });
              }
            })
          }
        });

        this.el.addEventListener("hitend", e => {
            // console.log("hit");
          if (e.detail !== undefined && e.detail !== null && e.detail.el !== undefined) {
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
              intersectTargetEl.setAttribute('data-hit', 1);
              if (intersectTargetEl !== undefined) {
                let proximity = this.calculateProximity(intersectTargetEl);
                let status = this.calculateStatus(intersectTargetEl);
                if (status === true) {
                  this.stopAnimations(intersectTarget);
                // console.log(intersectTargetEl, `${intersectTarget}-${intersectAction}`);
                  intersectTargetEl.emit(`${intersectTarget}-${intersectAction}`);
                }
              }
            }
          }
          // vrlog("hit");
        });
      },
      stopAnimations: function(id) {
        // let playedAll = el.getAttribute('data-played-all');
        // @TODO connect to elements.
        let playedAll = [
          'rose_metal',
          'four_am',
          'rosy_peachy'
        ];
        playedAll.forEach(item_id => {
          console.log(item_id);
          let hit = Number(document.querySelector(`#${item_id}-gltf`).getAttribute('data-hit'));
          console.log(hit, item_id);

          if (hit > 0) {
            // if already played, reverse the fade out direction.
            let animation = document.querySelector(`#${item_id}-gltf`).getAttribute('animation');
            if (id !== `${item_id}`) {
              console.log('not equal', id, item_id);
              if (animation.startEvents !== undefined && animation.startEvents[0] !== undefined) {
                animation.dir = "reverse";
                let startEvents = animation.startEvents[0];
                console.log(startEvents);
                document.querySelector(`#${item_id}-gltf`).setAttribute('animation', animation);
                document.querySelector(`#${item_id}-gltf`).emit(startEvents);
              }
            } else {
              animation.dir = "normal";
              console.log('normal', id);
              // document.querySelector(`#${id}-gltf`).setAttribute('animation', animation);
            }
          }
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
      },
      calculateProximity: function(el) {
        let head = document.querySelector('#head');
        let proximity = el.getAttribute('data-proximity');
        let proximityRadius = el.getAttribute('data-proximity-radius');
        // console.log('proximity', proximity, proximityRadius);
        // console.log(el);
        let elPosition = el.getAttribute("position");
        let headPosition = head.getAttribute("position");
        // console.log('positions', elPosition, headPosition);

      },
      calculateStatus: function(el) {
        let hit = el.getAttribute('data-hit');
        let play = el.getAttribute('data-play');
        if (Number(hit) === 1 && play === "false") {
          return false;
        }
        return true;
      }
    });
  }
}

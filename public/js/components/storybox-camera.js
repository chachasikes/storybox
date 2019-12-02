import { Camera, PerspectiveCamera, OrthographicCamera } from './../../lib/three.module.js';

export function registerComponent() {
  if (AFRAME.components["storybox-camera"] === undefined) {
    AFRAME.registerComponent('storybox-camera', {
      schema: {

      },
      init: function() {
        // console.log('storybox-camera', this.el);
        let camera = this.el;
        if (camera !== undefined) {
          // let threeCamera = new PerspectiveCamera();
          // console.log(threeCamera);
          // let cameraComponent = camera.components.camera;
          // console.log(cameraComponent);
          // cameraComponent.focus = 5;
          // cameraComponent.fov = 50;
          // cameraComponent.frustumCulled = false;



        }
        // let camera =
      },
      update: function() {
        // console.log('storybox-camera update', this);
      },
      // switchCamera: function(SCENE_WIDTH, SCENE_HEIGHT) {
      //   if (camera instanceof THREE.PerspectiveCamera) {
      //     camera = new THREE.OrthographicCamera( SCENE_WIDTH / - 2, SCENE_WIDTH / 2, SCENE_HEIGHT / 2, SCENE_HEIGHT / - 2, 0.1, 1000 );
      //     camera.position.x = 0;
      //     camera.position.y = 0;
      //     camera.position.z = -1;
      //     camera.lookAt(scene.position);
      //     this.perspective = "Orthographic";
      //   } else {
      //     camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
      //     camera.position.x = 0;
      //     camera.position.y = 0;
      //     camera.position.z = -1;
      //     camera.lookAt(scene.position);
      //     this.perspective = "Perspective";
      //   }
      // }
    })
  }
};

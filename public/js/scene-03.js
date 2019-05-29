export let Scene = {
  scene: 0,
  id: "forest",
  name: "A forest",
  duration: 30000,
  camera_1: {
    camera: {
      name: "World camera",
      id: "camera_1",
      position: {
        x:45,
        y:60,
        z:180
      },
    }
  },
  yellowLight: {
    light: {
      position: {
        x: 0,
        y: 15,
        z: 0
      },
      color: '#ffccff',
    }
  },
  skybox: {
    sky: {
      // color: "#FFCC00",
      // art: "https://dl.dropboxusercontent.com/s/7bt2oz3gukuporf/mountain_sky_equirectangular.png",
      // art: "/projects/sample/assets/images/skybox/mountain_sky_equirectangular.png",
      // art: "/projects/sample/assets/images/skybox/illustrator-background-01.png",
      art: "/projects/sample/assets/images/skybox/equirectangular.png",


      id: "mountain-sky",
      name: "Mountain Sky, hand painted",
      credit: "Chacha Sikes",
      rotation: {
        x:0,
        y:0,
        z:0
      },
    }
  },
  forest: {
    mesh: {
      name: "Forest Sketch",
      credit: "Chacha Sikes",
      id: "forest-sketch",
      // art: "https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/forest_rough_sketch.glb",
      art: "/projects/sample/assets/animations/forest_rough_sketch/forest_rough_sketch.glb",
      scale: {
        x: 5,
        y: 5,
        z: 5
      },
      position: {
        x: 0,
        y: -15,
        z: 0
      }
    },
  },

};

export let Scene = {
  scene: 0,
  name: "A forest",
  duration: 30000,
  camera_1: {
    name: "camera",
    camera: {
      position: {
        x: 20,
        y: 5,
        z: 50
      },
      lookat: {
        x: 0,
        y: 10,
        z: 0
      },
    },
    orbit: {
      lookat: {
        x: 0,
        y: 10,
        z: 0
      },
    }
  },
  lighting: {
    name: "light",
    light: {
      position: {
        x: -30,
        y: 40,
        z: -50
      },
      color: 0xFFFFFF,
    }
  },
  skybox: {
    sky: {
      // color: "#FFCC00",
      art: "https://dl.dropboxusercontent.com/s/7bt2oz3gukuporf/mountain_sky_equirectangular.png",
      id: "mountain-sky",
      name: "Mountain Sky, hand painted",
      credit: "Chacha Sikes"
    }
  },
  forest: {
    mesh: {
      name: "Forest Sketch",
      credit: "Chacha Sikes",
      id: "forest-sketch",
      art: "https://dl.dropboxusercontent.com/wh9s8aj56xxvdly/forest_rough_sketch.glb",
      scale: {
        x: 5,
        y: 5,
        z: 5
      },
    },
  },

};

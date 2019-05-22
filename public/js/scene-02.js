export let Scene = {
  scene: 1,
  name: "A forest",
  duration: 30000,
  camera_1: {
    camera: {
      name: "World camera",
      id: "camera_1",
      camera: {
        position: {
          x:45,
          y:60,
          z:180
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
      art: "https://dl.dropboxusercontent.com/s/7bt2oz3gukuporf/mountain_sky_equirectangular.png",
      id: "mountain-sky",
      name: "Mountain Sky, hand painted",
      credit: "Chacha Sikes",
      rotation: {
        x:0,
        y:0,
        z:270
      },
    }
  },
  forest: {
    mesh: {
      name: "Red",
      credit: "Chacha Sikes",
      id: "red-sketch",
      art: "https://dl.dropboxusercontent.com/s/ibqt6n45935pcv5/red.glb",
      scale: {
        x: 5,
        y: 5,
        z: 5
      },
    },
  },

};

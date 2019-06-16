export let Scene = {
  scene: 7,
  published: true,
  id: "texture_example_1",
  name: "Textures",
  duration: 60000,
  autoPlay: false,
  camera_2: {
    camera: {
      name: "World camera",
      id: "camera_scale",
      cursorCamera: false,
      fadeMask: false,
      position: {
        x: 9,
        y: 1.6,
        z: 0
      },
    },
  },
  light: {
    light: {
      type: 'point',
      position: {
        x: 1,
        y: 1,
        z: 1,
      },
      color: '#ffffff',
    }
  },
  grid: {
    imagecube: {
      art: "./images/grid-01.png",
      id: "grid-bkg",
      name: "Grid",
      credit: "Chacha Sikes",
      rotation: {
        x:0,
        y:0,
        z:0
      },
      position: {
        x:0,
        y:0,
        z:0
      },
      scale: {
        x: 100,
        y: 100,
        z: 100
      },
    }
  },
  blender_gltf: {
    mesh: {
      name: "Grid boxes of exact dimensions",
      credit: "Chacha Sikes",
      id: "blender-grid",
      art: "https://dl.dropboxusercontent.com/s/lrn724k6pmbpz5e/sketchfab-tiger-gray.glb", // Testing url cleanup
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    },
  },
};

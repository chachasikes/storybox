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
      id: "camera_scale_texture",
      cursorCamera: false,
      fadeMask: false,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 90,
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
        x: 1,
        y: 1,
        z: 1
      },
    }
  },
  title: {
    text: {
      id: "message_texture",
      text: "value: This is a 1.49m tiger; width: 10; color: #000000;",
      scale: {
        x: 1,
        y: 1,
        z: 1
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      position: {
        x: -5,
        y: 0,
        z: -5,
      }
    }
  },
  tiger_gltf: {
    mesh: {
      name: "Tiger",
      credit: "Chacha Sikes",
      id: "tiger",
      art: "https://www.dropbox.com/s/lrn724k6pmbpz5e/sketchfab-tiger-gray.glb?dl=0", // Testing url cleanup
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
        x: -0.5,
        y: 1,
        z: -0.5
      },
      texture: {
        art: "./examples/scenes/texture/images/texture.jpg"
      }
    },
  },
  // tiger_obj: {
  //   mesh: {
  //     name: "Tiger2",
  //     credit: "Chacha Sikes",
  //     id: "tiger-obj",
  //     art: "https://www.dropbox.com/s/snn2dimzlsfoxd7/tiger.obj?dl=0", // Testing url cleanup
  //     material: "https://www.dropbox.com/s/xsbdj4mneomxvgt/tiger.mtl?dl=0",
  //     scale: {
  //       x: 2,
  //       y: 2,
  //       z: 2,
  //     },
  //     rotation: {
  //       x: 0,
  //       y: 0,
  //       z: 0
  //     },
  //     position: {
  //       x: -2.5,
  //       y: 1,
  //       z: -2.5
  //     },
  //     texture: {
  //       art: "./examples/scenes/texture/images/texture.jpg"
  //     }
  //   },
  // },


};

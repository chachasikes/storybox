export let Scene = {
  scene: 0,
  published: true,
  id: "rose-accordion",
  name: "Rose Accordion",
  duration: 60000,
  autoPlay: false,
  camera_1: {
    camera: {
      name: "World camera",
      id: "camera_rose",
      cursorCamera: true,
      clickableClass: '.clickable',
      fadeMask: true,
      position: {
        x:0,
        y:60,
        z:180
      },
    }
  },
  ambientLight: {
    light: {
      position: {
        x: 100,
        y: 100,
        z: 200
      },
      color: '#ffffff',
    }
  },
  title: {
    text: {
      id: "scene-title",
      text: "value: A chord of rose.; color: black; width: 2;",
      scale: {
        x: 100,
        y: 100,
        z: 100
      },
      position: {
        x: 135,
        y: 24,
        z: -20,
      }
    }
  },
  skybox: {
    sky: {
      color: "#ededed",
      id: "light-background",
      name: "Fade in",
    }
  },

  scent_interface: {
    scent: {
      id: "rose-stretch",
      type: "stretch",
      ropeColor: "#7AC069",
      dimensions: {
        width: 100,
        height: 1,
        depth: 1,
      },
      a: {

          id: "leftPole",
          color: "#FA8072",
          dimensions: {
            width: 5,
            height: 200,
            depth: 5,
          },
          position: {
            x: -50,
            y: 1,
            z: -1,
          },

      },
      b: {

          id: "rightPole",
          color: "#7AC069",
          dimensions: {
            width: 5,
            height: 200,
            depth: 5,
          },
          position: {
            x: 50,
            y: 1,
            z: -4,
          },

      },
      maxWidth: 100,
      minWidth: 0,
      // line:
      // physics:
      positions: [
        {
          art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
          // behavior: 'playAnimation',
          //
          x: 3,
          y: 0,
          z: 0,
        },
        {
          art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
          // behavior: 'playAnimation',
          x: 50,
          y: 0,
          z: 0,
        },
        {
          art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
          // behavior: 'playAnimation',
          x: 90,
          y: 0,
          z: 0,
        }
      ]
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
        x: 1000,
        y: 1000,
        z: 1000
      },
    }
  },
};

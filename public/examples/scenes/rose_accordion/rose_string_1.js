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
      handProp: {
        id: "rose-stretch",
        type: "stretch",
        stretchAxis: 'x',
        ropeColor: "#7AC069",
        dimensions: {
          width: 100,
          height: 1,
          depth: 1,
        },
        a: {
            id: "leftStretch",
            color: "#FA8072",
            dimensions: {
              width: 0.02,
              height: 0.4,
              depth: 0.02,
            },
            position: {
              x: 0,
              y: 0.01,
              z: -0.02,
            },
            rotation: {
              x: -15,
              y: 0,
              z: 0,
            }

        },
        b: {
            id: "rightStretch",
            color: "#7AC069",
            dimensions: {
              width: 0.02,
              height: 0.4,
              depth: 0.02,
            },
            position: {
              x: 0,
              y: 0.01,
              z: -0.02,
            },
            rotation: {
              x: -15,
              y: 0,
              z: 0,
            }
        },
        maxWidth: 5,
        minWidth: 0,
        positions: [
          {
            art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
            // behavior: 'playAnimation',
            type: "percentage",
            //
            position: {
              x: 0.2,
              y: 1,
              z: -1,
            },
            color: "#f7e6af",
            id: 'damascone',
          },
          {
            art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
            // behavior: 'playAnimation',
            type: "percentage",
            position: {
              x: 0.45,
              y: 0,
              z: 0,
            },
            color: "#bbe266",
            id: 'cis-3-hex',
          },
          {
            art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
            // behavior: 'playAnimation',
            type: "percentage",
            position: {
              x: 0.7,
              y: 0,
              z: 0,
            },
            color: "#f4a8e1",
            id: 'linalool',
          },
          {
            art: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
            // behavior: 'playAnimation',
            type: "percentage",
            position: {
              x: 0.95,
              y: 0,
              z: 0,
            },
            color: "#f4eea8",
            id: 'citronellol',
          }
        ]
      }
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

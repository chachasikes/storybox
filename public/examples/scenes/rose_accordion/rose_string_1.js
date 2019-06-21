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
      fadeMask: false,
      testUpdateFunction: 'updateAccordionLine',
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      handProp: {
        id: "rose-stretch",
        type: "stretch",
        ropeColor: "#000000",
        a: {
            id: "leftStretch",
            tickFunction: 'updateAccordionLine',
            color: "#FA8072",
            dimensions: {
              width: 0.02,
              height: 0.4,
              depth: 0.2,
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
            color: "#FA8072",
            tickFunction: 'updateAccordionLine',
            dimensions: {
              width: 0.02,
              height: 0.4,
              depth: 0.2,
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
        positions: [
          {
            type: "percentage",
            position: {
              x: 0.45,
              y: 0,
              z: 0,
            },
            color: "#bbe266",
            id: 'geraniol',
          },
          {
            type: "percentage",
            position: {
              x: 0.7,
              y: 0,
              z: 0,
            },
            color: "#f4a8e1",
            id: 'PEA',
          },
          {
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
        y:5,
        z:0
      },
      scale: {
        x: 10,
        y: 10,
        z: 10
      },
    }
  },
};

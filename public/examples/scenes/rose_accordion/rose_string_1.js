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
      headProp: {
        id: '#head-bubble',
        type: 'intersect',
        color: 'pink',
        intersectClass: ".scent",
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
        stretchAxis: 'x',
        positions: [
          {
            type: "percentage",
            position: {
              x: 0.2,
              y: 0.01, // These would just be offsets
              z: 0.001,
            },
            color: "#bbe266",
            id: 'geraniol',
            intersect: '#head',
            intersectAction: 'openScene',
            sceneTarget: 'geraniol-scene',
          },
          {
            type: "percentage",
            position: {
              x: 0.4,
              y: -0.2,
              z: -0.002,
            },
            color: "#f4a8e1",
            id: 'PEA',
            intersect: '#head',
            intersectAction: 'openScene',
            sceneTarget: 'pea-scene',
          },
          {
            type: "percentage",
            position: {
              x: 0.7,
              y: 0,
              z: 0,
            },
            color: "#f4eea8",
            id: 'citronellol',
            intersect: '#head',
            intersectAction: 'openScene',
            sceneTarget: 'citronellol-scene',
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

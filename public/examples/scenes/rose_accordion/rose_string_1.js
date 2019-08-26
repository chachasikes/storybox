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
            id: 'geraniol-intersect',
            intersect: true,
            collisionClass: "head",
            intersectAction: 'intersectSceneAccordion',
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
            id: 'pea-intersect',
            intersect: true,
            collisionClass: "head",
            intersectAction: 'intersectSceneAccordion',
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
            id: 'citronellol-intersect',
            intersect: true,
            collisionClass: "head",
            intersectAction: 'intersectSceneAccordion',
            sceneTarget: 'citronellol-scene',
          }
        ]
      }
    }
  },
  // ambientLight: {
  //   light: {
  //     position: {
  //       x: 100,
  //       y: 100,
  //       z: 200
  //     },
  //     color: '#ffffff',
  //   }
  // },
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
  nosina: {
mesh: {
  name: "Nosina",
  credit: "Sarah Chalek & Chacha Sikes",
  id: "nosina",
  art: "https://www.dropbox.com/s/z9q199hf0utq5px/nosina_alembic_test.glb?dl=0",
  opacity: 1,
  scale: {
    x: 5,
    y: 5,
    z: 5,
  },
  rotation: {
    x: 0,
    y: 180,
    z: 0
  },
  position: {
    x: -7,
    y: 1,
    z: -3
  }
},
  },
  citronellol: {
    mesh: {
      name: "Citronellol",
      credit: "Chacha Sikes",
      id: "citronellol",
      art: "https://dl.dropboxusercontent.com/s/9yp0liedpg0fiji/citronellol.glb",
      opacity: 0.6,
      scale: {
        x: 10,
        y: 10,
        z: 10,
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      position: {
        x: 5,
        y: 0,
        z: 0
      }
    },
  },
  geraniol: {
    mesh: {
      name: "Geraniol",
      credit: "Chacha Sikes",
      id: "geraniol",
      art: "https://dl.dropboxusercontent.com/s/9zvwzs2a4c9ef1e/geraniol.glb",
      opacity: 0.6,
      texture: "opacity:0.6;normalPath:https://dl.dropboxusercontent.com/s/lzbhks37mnd1cs0/Tiles_025_normal.jpg;path:https://dl.dropboxusercontent.com/s/1zr2u9xl5fpyjtv/Tiles_025_Base_Color.jpg",
      // ;bumpPath:https://dl.dropboxusercontent.com/s/6vw8mi8k4t8txuy/Tiles_025_height.png;roughnessPath:https://dl.dropboxusercontent.com/s/1yasqzucfva4ja4/Tiles_025_roughness.jpg;ambientOcculsionPath:https://www.dropbox.com/s/xzh6yhhlrtxh183/Tiles_025_ambientOcclusion.jpg:
      scale: {
        x: 10,
        y: 10,
        z: 10,
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      position: {
        x: 5,
        y: 0,
        z: 0
      }
    }
  },
  pea: {
    mesh: {
      name: "pea",
      credit: "Chacha Sikes",
      id: "pea",
      art: "https://dl.dropboxusercontent.com/s/7lrq77w9fb6boeo/pea.glb",
      opacity: 0.6,
      scale: {
        x: 10,
        y: 10,
        z: 10,
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      position: {
        x: 5,
        y: 0,
        z: 0
      }
    }
  },
};

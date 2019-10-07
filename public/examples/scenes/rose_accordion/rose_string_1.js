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
      cursorCamera: false,
      fadeMask: false,
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
        id: "#head-bubble",
        type: "intersect",
        color: "pink"
      },
      handProp: {
        id: "rose-stretch",
        type: "stretch",
        ropeColor: "#000000",
        a: {
          id: "leftStretch",
          color: "#FA8072",
          dimensions: {
            width: 0.02,
            height: 0.4,
            depth: 0.2
          },
          position: {
            x: 0,
            y: 0.01,
            z: -0.02
          },
          rotation: {
            x: -15,
            y: 0,
            z: 0
          }
        },
        b: {
          id: "rightStretch",
          color: "#FA8072",
          dimensions: {
            width: 0.02,
            height: 0.4,
            depth: 0.2
          },
          position: {
            x: 0,
            y: 0.01,
            z: -0.02
          },
          rotation: {
            x: -15,
            y: 0,
            z: 0
          }
        },
        stretchAxis: "x",
        positions: [
          {
            type: "percentage",
            position: {
              x: 0.3,
              y: 0.001,
              z: 0
            },
            color: "#f4eea8",
            id: "citronellol-intersect",
            intersect: true,
            collisionClass: "head",
            intersectTarget: "nosina_1",
            intersectAction: 'fadeInObject',
            radius: 2,
          },
          {
            type: "percentage",
            position: {
              x: 0.6,
              y: 0.001,
              z: 0
            },
            color: "#f4a8e1",
            id: "pea-intersect",
            intersect: true,
            collisionClass: "head",
            intersectTarget: "nosina_2",
            intersectAction: 'fadeInObject',
            radius: 0.4,
          },
          {
            type: "percentage",
            position: {
              x: 0.85,
              y: 0.001, // These would just be offsets
              z: 0
            },
            color: "#bbe266",
            id: "geraniol-intersect",
            intersect: true,
            collisionClass: "head",
            intersectTarget: "nosina_3",
            intersectAction: 'fadeInObject',
            radius: 0.4,
          }
        ]
      }
    }
  },
  ambientLight: {
    light: {
      type: "ambient",
      position: {
        x: 100,
        y: 100,
        z: 200
      },
      color: "#ffffff"
    }
  },
  skybox: {
    sky: {
      color: "#ededed",
      id: "light-background",
      name: "Fade in"
    }
  },
  grid: {
    imagecube: {
      art: "./images/grid-01.png",
      id: "grid-bkg",
      name: "Grid",
      credit: "Chacha Sikes",
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: 5,
        z: 0
      },
      scale: {
        x: 10,
        y: 10,
        z: 10
      }
    }
  },
  nosina: {
    mesh: {
      name: "Nosina",
      credit: "Sarah Chalek & Chacha Sikes",
      id: "nosina_1",
      art:
        "https://www.dropbox.com/s/z9q199hf0utq5px/nosina_alembic_test.glb?dl=0",
      opacity: 0,
      scale: {
        x: 1.5,
        y: 1.5,
        z: 1.5
      },
      rotation: {
        x: 0,
        y: 210,
        z: 0
      },
      position: {
        x: -2,
        y: 0.25,
        z: -2
      }
    }
  },
  nosina2: {
    mesh: {
      name: "Nosina",
      credit: "Sarah Chalek & Chacha Sikes",
      id: "nosina_2",
      art:
        "https://www.dropbox.com/s/z9q199hf0utq5px/nosina_alembic_test.glb?dl=0",
      opacity: 0,
      scale: {
        x: 5,
        y: 5,
        z: 5
      },
      rotation: {
        x: 0,
        y: 210,
        z: 0
      },
      position: {
        x: -5,
        y: 0.25,
        z: -10
      }
    }
  },
  nosina3: {
    mesh: {
      name: "Nosina",
      credit: "Sarah Chalek & Chacha Sikes",
      id: "nosina_3",
      art:
        "https://www.dropbox.com/s/z9q199hf0utq5px/nosina_alembic_test.glb?dl=0",
      opacity: 0,
      scale: {
        x: 2,
        y: 2,
        z: 2
      },
      rotation: {
        x: 0,
        y: 210,
        z: 0
      },
      position: {
        x: 3,
        y: 0.25,
        z: -2
      }
    }
  }

  // train_station: {
  //   mesh: {
  //     name: "Set",
  //     credit: "Chacha Sikes & Sarah Chalek",
  //     id: "train-station",
  //     art: "https://www.dropbox.com/s/bca80aqnz14chxb/rose-accordion-animation.glb?dl=0",
  //     opacity: 1,
  //     scale: {
  //       x: 10,
  //       y: 10,
  //       z: 10,
  //     },
  //     rotation: {
  //       x: 0,
  //       y: 0,
  //       z: 0
  //     },
  //     position: {
  //       x: 4,
  //       y: 0,
  //       z: 2.5
  //     }
  //   },
  // },
};

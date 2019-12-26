export let Scene = {
  scene: 0,
  published: true,
  id: "rose-accordion",
  name: "Rose Accordion",
  duration: 300000,
  autoPlay: true,
  skybox: {
    sky: {
      color: "#ededed",
      id: "light-background",
      name: "Fade in"
    }
  },
  camera_1: {
    camera: {
      name: "World camera",
      id: "camera_rose",
      cursorCamera: false,
      // fov: 40,
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
            width: 0.01,
            height: 0.01,
            depth: 0.01
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
          },
          opacity: 0
        },
        b: {
          id: "rightStretch",
          color: "#FA8072",
          dimensions: {
            width: 0.01,
            height: 0.01,
            depth: 0.01
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
          },
          opacity: 0
        },
        stretchAxis: "x",
        positions: [
          {
            type: "percentage",
            position: {
              x: 0.25,
              y: 0.2,
              z: 0
            },
            color: "#888888",
            id: "rose_metal_intersect",
            intersect: true,
            collisionClass: "head",
            intersectTarget: "rose_metal",
            intersectAction: 'fadeInObject',
            radius: 0.4,
          },
          {
            type: "percentage",
            position: {
              x: 0.5,
              y: 0.2,
              z: 0
            },
            color: "#f4a8e1",
            id: "rosy_peachy_intersect",
            intersect: true,
            collisionClass: "head",
            intersectTarget: "rosy_peachy",
            intersectAction: 'fadeInObject',
            radius: 0.4,
          },
          {
            type: "percentage",
            position: {
              x: 0.75,
              y: 0.2, // These would just be offsets
              z: 0
            },
            color: "#249411",
            id: "four_am_intersect",
            intersect: true,
            collisionClass: "head",
            intersectTarget: "four_am",
            intersectAction: 'fadeInObject',
            radius: 0.4,
          }
        ],
        mesh: {
          art: "https://www.dropbox.com/s/bap92gxc3ldd8s0/accordion_actions.glb?dl=0",
          id: "accordion",
          className: 'carrying',
          name: "Accordion",
          autoPlay: true,
          animationMixer: {
            type: 'stretch',
            squash: 'squash',
            stretch: 'stretch',
            loop: 'once',
            repetitions: "Infinity",
            timeScale: 1,
          },
          scale: {
            x: 0.5,
            y: 0.5,
            z: 0.5
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0
          },
          position: {
            x: 0,
            y: 1.6,
            z: -0.4
          },
        },
        // sound: {
        //   // src: 'https://www.dropbox.com/s/nyt7g9167iikmpz/tchaikovsky_flower_waltz_ACC.mp3?dl=0',
        //   // id: 'dance_of_flowers',
        //   // name : 'Dance of Flowers',
        //   // credit : 'https://www.8notes.com/scores/23736.asp?ftype=mp3',
        //   // autoplay : true,
        //   // distanceModel : 'inverse',
        //   // loop : true,
        //   // maxDistance : 5,
        //   // poolSize : 1,
        //   // positional : true,
        //   // refDistance : 1,
        //   // rolloffFactor : 1,
        //   // volume : 1
        //   type: 'midi-player',
        //   soundfont: 'accordion',
        //   id: 'accordion-song',
        //   song: 'C4'
        // }
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
  rose_metal: {
    mesh: {
      name: "Rose Metal",
      credit: "Sarah Chalek & Chacha Sikes",
      id: "rose_metal",
      art: "https://www.dropbox.com/s/aelwtoatbshexvf/rose-metal-lights.glb?dl=0",
      opacity: 0,
      scale: {
        x: 1,
        y: 1,
        z: 1
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
      },
      events: [{
        id: 'rose_metal',
        eventName: 'fadeInObject',
        type: 'intersection-play',
        attribute: "gltf-model-opacity",
        duration: "5000",
        from: "0",
        to: "1",
        repeat: true,
        elasticity: 400,
        loop: false,
        delay: 0,
        dir: 'alternate',
        round: false,
        proximity: {
          radius: 10
        }
      }]
    }
  },
  rosy_peachy: {
    mesh: {
      name: "Rosy Peachy",
      credit: "Sarah Chalek & Chacha Sikes",
      id: "rosy_peachy",
      art: "https://www.dropbox.com/s/1pp0vyfnhjz38k3/rosy-peachy.glb?dl=0",
      opacity: 0,
      scale: {
        x: 1,
        y: 1,
        z: 1
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
      },
      events: [{
        id: 'rosy_peachy',
        eventName: 'fadeInObject',
        type: 'intersection-play',
        attribute: "gltf-model-opacity",
        duration: "5000",
        from: "0",
        to: "1",
        repeat: true,
        elasticity: 400,
        loop: false,
        delay: 0,
        dir: 'alternate',
        round: false,
        proximity: {
          radius: 10
        }
      }]
    }
  },
  four_am: {
    mesh: {
      name: "four_am",
      credit: "Sarah Chalek & Chacha Sikes",
      id: "four_am",
      art: "https://www.dropbox.com/s/dsknrain4eopjt7/rose_metal.glb?dl=0",
      opacity: 0,
      scale: {
        x: 1,
        y: 1,
        z: 1
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
      },
      events: [{
        id: 'four_am',
        eventName: 'fadeInObject',
        type: 'intersection-play',
        attribute: "gltf-model-opacity",
        duration: "5000",
        from: "0",
        to: "1",
        repeat: true,
        elasticity: 400,
        loop: false,
        delay: 0,
        dir: 'alternate',
        round: false,
        proximity: {
          radius: 10
        }
      }]
    }
  },
  train_station: {
    mesh: {
      name: "Set",
      credit: "Concept: Sarah Chalek & Immersive illustration: Chacha Sikes",
      id: "train-station",
      art: "https://www.dropbox.com/s/bj6oj5sanv77kg6/train-station.glb?dl=0",
      opacity: 1,
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
  }
};

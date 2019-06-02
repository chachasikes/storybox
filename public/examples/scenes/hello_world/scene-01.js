export let Scene = {
  scene: 1,
  published: true,
  id: "scent_experiment_tiltbrush_1",
  name: "Scent Experiment #1",
  duration: 30000,
  autoPlay: true,
  sound_of_click: {
    audio: {
      id: 'click-sound',
      // src: 'https://cdn.aframe.io/360-image-gallery-boilerplate/audio/click.ogg',
      src: 'https://dl.dropboxusercontent.com/s/bf543y6brdrcjte/27880__stickinthemud__bike-horn-1.ogg',
      position: {
        x:5,
        y:5,
        z:5
      },
    }
  },
  camera_2: {
    camera: {
      name: "World camera",
      id: "camera_2",
      cursorCamera: true,
      fadeMask: false,
      position: {
        x: 0,
        y: 30,
        z: 180
      },
      touch: {
        left: {
          glb: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
          id: 'left-rose-hand',
          scale: {
            x: 0.001,
            y: 0.001,
            z: 0.001
          },
          position: {
            x: -0.04,
            y: -0.05,
            z: -0.1
          },
        },
      },
      // laser: {
      //   left: {
      //     line: {
      //       color: 'red',
      //       opacity: '0.5'
      //     }
      //   },
      //   right: {
      //     line: {
      //       color: 'blue',
      //       opacity: '0.5'
      //     }
      //   }
      // }
    },
  },
  startButton: {
    box: {
      color: "red",
      type: "button",
      id: "play-button",
      className: "clickable",
      eventName: "playScene",
      camera: "camera_2",
      position: {
        x: 0,
        y: 0,
        z: -20
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      dimensions: {
        width: 40,
        height: 40,
        depth: 40,
      }
    },
  },
  yellowLight: {
    light: {
      type: 'ambient',
      position: {
        x: 0,
        y: 15,
        z: 0
      },
      color: '#ffffff',
    }
  },
  roomcube: {
    imagecube: {
      art: {
        top: "https://dl.dropboxusercontent.com/s/ccp18hfjbiehb24/top.jpg",
        bottom: "https://dl.dropboxusercontent.com/s/a3ydsbfk829c6f6/bottom.jpg",
        left: "https://dl.dropboxusercontent.com/s/y1uabd3m0xeob01/left.jpg",
        right: "https://dl.dropboxusercontent.com/s/4gjmp0l7i30esv1/right.jpg",
        front: "https://dl.dropboxusercontent.com/s/md4djd9bsftncpq/front.jpg",
        back: "https://dl.dropboxusercontent.com/s/py0mgmi726okzxo/back.jpg",
      },
      id: "room-cube",
      name: "Grid",
      credit: "Chacha Sikes",
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
      scale: {
        x: 3000,
        y: 3000,
        z: 3000
      },
    }
  },
  // scent_experiment_tiltbrush: {
  //   mesh: {
  //     name: "Scent Experiment #1",
  //     credit: "Chacha Sikes",
  //     id: "scent-experiment-1",
  //     // art: "https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/forest_rough_sketch.glb",
  //     art: "https://dl.dropboxusercontent.com/s/ru8ke7csnhonff2/scent_experiment_tiltbrush.glb",
  //     scale: {
  //       x: 200,
  //       y: 200,
  //       z: 200,
  //     },
  //     rotation: {
  //       x: 0,
  //       y: 50,
  //       z: 0
  //     },
  //     position: {
  //       x: 0,
  //       y: -300,
  //       z: 0
  //     }
  //   },
  // },
  quill_alembic: {
    mesh: {
      name: "Café Smoke Animation Example",
      credit: "Chacha Sikes",
      id: "cafe-smoke-animation",
      // art: "https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/forest_rough_sketch.glb",
      art: "https://dl.dropboxusercontent.com/s/qflnw8ub61obgwx/Cafesmoke.glb",
      scale: {
        x: 100,
        y: 100,
        z: 100,
      },
      rotation: {
        x: 0,
        y: 50,
        z: 0
      },
      position: {
        x: 0,
        y: -100,
        z: 0
      }
    },
  },
};

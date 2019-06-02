export let Scene = {
  scene: 1,
  published: true,
  id: "scent_experiment_tiltbrush_1",
  name: "Scent Experiment #1",
  duration: 30000,
  autoPlay: false,
  sound_of_click: {
    audio: {
      id: 'click-sound',
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
      clickableClass: '.clickable',
      fadeMask: false,
      position: {
        x: 50,
        y: 40,
        z: 30
      },
      touch: {
        left: {
          glb: 'https://dl.dropboxusercontent.com/s/u9o72m7y4mocn4s/dried_yellow_rose.glb',
          id: 'left-rose-hand',
          scale: {
            x: 0.05,
            y: 0.05,
            z: 0.05
          },
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
        },
      },
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
        y: 0.5,
        z: -20
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      dimensions: {
        width: 10,
        height: 10,
        depth: 10,
      },
      click: "color: yellow",
      mouseenter: "scale: 1.2 1.2 1.2; color: blue",
      mouseleave:"scale: 1 1 1; color: red",
      sound: "on: click; src: #click-sound"
    },
  },
  ambientLight: {
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
        y: 10,
        z: 0
      },
      scale: {
        x: 400,
        y: 400,
        z: 400
      },
    }
  },
  quill_alembic: {
    mesh: {
      name: "Café Smoke Animation Example",
      credit: "Chacha Sikes",
      id: "cafe-smoke-animation",
      art: "https://dl.dropboxusercontent.com/s/qflnw8ub61obgwx/Cafesmoke.glb",
      scale: {
        x: 90,
        y: 90,
        z: 90,
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

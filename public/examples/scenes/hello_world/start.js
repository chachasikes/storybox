export let Scene = {
  scene: 0,
  published: true,
  id: "start",
  name: "Start Screen",
  duration: 60000,
  autoPlay: false,
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
  loading: {
    image: {
      id: "loading-graphic",
      art: "./images/storybox-02.png",
      scale: {
        x: 150,
        y: 50,
        z: 1
      },
      position: {
        x: 50,
        y: 50,
        z: 0,
      }
    }
  },
  camera_1: {
    camera: {
      name: "World camera",
      id: "camera_1",
      cursorCamera: true,
      fadeMask: true,
      position: {
        x:0,
        y:60,
        z:180
      },
    }
  },
  yellowLight: {
    light: {
      position: {
        x: 100,
        y: 100,
        z: 200
      },
      color: '#ffffff',
    }
  },
  startButton: {
    box: {
      color: "red",
      type: "button",
      id: "play-button",
      className: "clickable",
      eventName: "playScene",
      camera: "camera_1",
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
  title: {
    text: {
      id: "scene-title",
      text: "value: Immersive Story Player; color: black; width: 2;",
      scale: {
        x: 100,
        y: 100,
        z: 100
      },
      position: {
        x: 135,
        y: 25,
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

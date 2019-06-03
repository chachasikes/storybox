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

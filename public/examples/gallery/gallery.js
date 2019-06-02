export let Scene = {
  scene: 0,
  published: true,
  id: "gallery_scene",
  name: "Start Screen",
  duration: 60000,
  autoPlay: false,
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
        y: 80,
        z: 0,
      }
    }
  },
  camera_1: {
    camera: {
      name: "World camera",
      id: "gallery_camera",
      cursorCamera: true,
      fadeMask: true,
      clickableClass: '.clickable-tile',
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
      id: "gallery_menu_prompt",
      text: "value: Immersive story player; color: black; width: 2;",
      scale: {
        x: 100,
        y: 100,
        z: 100
      },
      position: {
        x: 135,
        y: 60,
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

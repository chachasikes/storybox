export let Scene = {
  scene: 4,
  published: true,
  id: "tincture_of_sea",
  name: "Tincture of Sea",
  duration: 60000,
  autoPlay: true,
  camera_3: {
    camera: {
      name: "World camera",
      id: "camera_5",
      cursorCamera: false,
      clickableClass: '.clickable',
      fadeMask: false,
      position: {
        x: 45,
        y: 0,
        z: 0
      },
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
  skybox: {
    sky: {
      color: "#fefefe",
      // art: "https://dl.dropboxusercontent.com/s/7bt2oz3gukuporf/mountain_sky_equirectangular.png",
      // art: "https://dl.dropboxusercontent.com/s/4q6swr0zsn4g4je/Free-HDR-Sky-Unity-Asset-Store.jpg",
      id: "sky-photo-2",
      name: "Gray sky",
      credit: "Chacha Sikes",
      rotation: {
        x:0,
        y:90,
        z:0
      },
    }
  },
  quill_alembic: {
    mesh: {
      name: "Tincture of Sea",
      credit: "Chacha Sikes",
      id: "tincture-of-sea",
      // art: "https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/forest_rough_sketch.glb",
      art: "https://dl.dropboxusercontent.com/s/kgtuq7g1lylr9wv/tincture-of-sea.glb",
      scale: {
        x: 80,
        y: 80,
        z: 80,
      },
      rotation: {
        x: 0,
        y: -30,
        z: 0
      },
      position: {
        x: 180,
        y: -80,
        z: 0
      }
    },
  },
};

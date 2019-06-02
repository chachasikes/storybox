export let Scene = {
  scene: 2,
  published: false,
  id: "simple_smoke_animation",
  name: "Simple Smoke animation",
  duration: 60000,
  autoPlay: true,
  camera_3: {
    camera: {
      name: "World camera",
      id: "camera_3",
      cursorCamera: false,
      clickableClass: '.clickable',
      fadeMask: false,
      position: {
        x: 0,
        y: 30,
        z: 180
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
      // color: "#FFCC00",
      art: "https://dl.dropboxusercontent.com/s/7bt2oz3gukuporf/mountain_sky_equirectangular.png",
      // art: "https://dl.dropboxusercontent.com/s/4q6swr0zsn4g4je/Free-HDR-Sky-Unity-Asset-Store.jpg",
      id: "sky-photo",
      name: "Sky - from internet",
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
      name: "Café Smoke Animation Example",
      credit: "Chacha Sikes",
      id: "cafe-smoke-animation",
      // art: "https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/forest_rough_sketch.glb",
      art: "https://dl.dropboxusercontent.com/s/qflnw8ub61obgwx/Cafesmoke.glb",
      scale: {
        x: 200,
        y: 200,
        z: 200,
      },
      rotation: {
        x: 0,
        y: 50,
        z: 0
      },
      position: {
        x: 0,
        y: -300,
        z: 0
      }
    },
  },
};

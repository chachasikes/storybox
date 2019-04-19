export let Scene = {
      scene: 0,
      title: "Scene 1",
      description: "A forest",
      duration: 10000,
      group: [
        {
          name: "camera",
          camera: {
            position: {
              x: 20,
              y: 5,
              z: 50
            },
            lookat: {
              x: 0,
              y: 10,
              z: 0
            },
          },
          orbit: {
            lookat: {
              x: 0,
              y: 10,
              z: 0
            },
          }
        },

        // a light
        {
          name: "light",
          light: {
            position: {
              x: -30,
              y: 40,
              z: -50
            },
            color: 0xFFFFFF,
          }
        },

        // a skybox
        {
          name: "sky",
          sky: {
            art: "https://www.dropbox.com/s/isug6g2w8src68y/scene.gltf?dl=1",
          }
        },

        {
          name: "animation",
          load: "https://www.dropbox.com/sh/1m9xyn46vnkg4w2/AABdPN6dt5Tk5Sb7ts5Q_0wQa?dl=1",
          mesh: {
            scale: {
              x: 1,
              y: 1,
              z: 1
            },
          },
        },
      ]
};

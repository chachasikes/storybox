export let Scene = {
      scene: 0,
      title: "Scene 1",
      description: "A forest",
      duration: 30000,
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
            art: "https://dl.dropboxusercontent.com/s/7bt2oz3gukuporf/mountain_sky_equirectangular.png",
          }
        },
        {
          name: "animation",
          mesh: {
            art: "https://dl.dropboxusercontent.com/s/isug6g2w8src68y/scene.gltf",
            bin: "https://dl.dropboxusercontent.com/s/y7681t5jqal3iya/scene.bin",
            scale: {
              x: 5,
              y: 5,
              z: 5
            },
          },
        },
      ]
};

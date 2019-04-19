export let Scene = {
      scene: 1,
      title: "Scene 2",
      description: "A flower",
      duration: 70000,
      group: [{
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
          name: "flower",
          mesh: {
            art: "https://dl.dropboxusercontent.com/s/574jrne8cb60mtp/scene.gltf",
            bin: "https://dl.dropboxusercontent.com/s/1mr52php5mdtipj/scene.bin",
            scale: {
              x: 3,
              y: 3,
              z: 3
            },
          },
        },
    ]
};

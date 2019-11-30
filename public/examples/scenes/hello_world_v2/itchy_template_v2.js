export let Scene = {
      scene : 1,
      published : true,
      id : 'itchy_v2_scene',
      name : 'Itchy',
      duration : 60000,
      autoPlay : true,
      camera_itchy : {
        camera : {
          name : 'World camera',
          id : 'itchy_v2_camera_1',
          cursorCamera : true,
          cursorTargetClass : '.clickable',
          clickableClass : '.clickable',
          position : {
            x : 0,
            y : 0,
            z : 0
          },
          rotation : {
            x : 0,
            y : 0,
            z : 0
          }
        }
      },
      ambientLight : {
        light : {
          type : 'ambient',
          position : {
            x : 0,
            y : 30,
            z : 0
          },
          color : '#ffffff',
          intensity: 1
        }
      },
      // pointLight : {
      //   light : {
      //     type : 'point',
      //     position : {
      //       x : 0,
      //       y : 30,
      //       z : 0
      //     },
      //     color : '#ffffff',
      //     intensity: 1.3
      //   }
      // },
      // skybox : {
      //   sky : {
      //     color : '#ffffff',
      //     id : 'light-background',
      //     name : 'Light background'
      //   }
      // },
      // loading : {
      //   image : {
      //     id : 'loading-graphic',
      //     art : './images/storybox-02.png',
      //     scale : {
      //       x : 150,
      //       y : 75,
      //       z : 1
      //     },
      //     position : {
      //       x : 50,
      //       y : 50,
      //       z : 0
      //     }
      //   }
      // },
      river_sound_test : {
        mesh : {
          name : 'Sphere GLB - Cardboard texture 1',
          id : 'itchy-sphere-1',
          className : 'clickable',
          art : 'https://www.dropbox.com/s/zrloz4b68vaayb4/sphere.glb?dl=0',
          scale : {
            x : 0.2,
            y : 0.2,
            z : 0.2
          },
          rotation : {
            x : 0,
            y : 0,
            z : 0
          },
          position : {
            x : -2,
            y : 2,
            z : -5
          },
          sound : {
            src : 'https://www.dropbox.com/s/0xjyu13axxto84n/24511__glaneur-de-sons__riviere-river.ogg?dl=0',
            id : 'french river',
            on : 'click',
            name : 'River',
            credit : 'Free sound effects file (test only, not for production)',
            autoplay : true,
            distanceModel : 'inverse',
            loop : true,
            maxDistance : 5,
            poolSize : 1,
            positional : true,
            refDistance : 1,
            rolloffFactor : 1,
            volume : 0.01
          },
          texture : {
            src : 'https://www.dropbox.com/s/hjyds7sb3ffjjam/Paper_Recycled_001_COLOR.jpg?dl=0',
            ambientOcculsionMap : 'https://www.dropbox.com/s/vw66azxdp21ws03/Paper_Recycled_001_OCC.jpg?dl=0',
            normalMap : 'https://www.dropbox.com/s/4r57sz174iz3aux/Paper_Recycled_001_NORM.jpg?dl=0',
            roughnessMap : 'https://www.dropbox.com/s/uio3sshwr8pldtz/Paper_Recycled_001_ROUGH.jpg?dl=0'
          }
        }
      },
      peach: {
        mesh: {
          name: 'peachypeach',
          id: 'itchy_v2_peach',
          art: 'https://www.dropbox.com/s/nknj8a213a9mdks/peach_blender_fix.glb?dl=0',
          // art: 'https://www.dropbox.com/s/dsknrain4eopjt7/rose_metal.glb?dl=0',
          // art: 'https://www.dropbox.com/s/bsypjusxri5wp0b/peach_tiltbrush_chach.glb?dl=0',
          scale : {
            x : 1,
            y : 1,
            z : 1
          },
          rotation : {
            x : 90,
            y : 0,
            z : 0
          },
          position : {
            x : -5,
            y : -10,
            z : -5
          },
        }
      },
      mosquito : {
        mesh : {
          name : 'Sphere GLB - Cardboard texture 2',
          id : 'itchy-sphere-2',
          className : 'clickable',
          art : 'https://www.dropbox.com/s/f3lz0z9j1h3og53/mosquito_tiltbrush_colorspace_test.glb?dl=0',
          scale : {
            x : 10,
            y : 10,
            z : 10
          },
          rotation : {
            x : 0,
            y : 0,
            z : 0
          },
          position : {
            x : 2,
            y : -10,
            z : 5
          },
          sound : {
            src : 'https://www.dropbox.com/s/9l04efr6eihexw8/mo.ogg?dl=0',
            id : '360_panning_mosquito',
            on : 'click',
            name : 'Buzzing mosquito',
            credit : 'Free sound effects file (test only, not for production)',
            autoplay : false,
            distanceModel : 'inverse',
            loop : true,
            maxDistance : 5,
            poolSize : 1,
            positional : true,
            refDistance : 1,
            rolloffFactor : 1,
            volume : 1
          }
        }
      }
    };

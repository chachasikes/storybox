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
            y : 15,
            z : 0
          },
          color : '#ffffff'
        }
      },
      skybox : {
        sky : {
          color : '#ededed',
          id : 'light-background',
          name : 'Light background'
        }
      },
      loading : {
        image : {
          id : 'loading-graphic',
          art : './images/storybox-02.png',
          scale : {
            x : 150,
            y : 75,
            z : 1
          },
          position : {
            x : 50,
            y : 50,
            z : 0
          }
        }
      },
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
      mosquito : {
        mesh : {
          name : 'Sphere GLB - Cardboard texture 2',
          id : 'itchy-sphere-2',
          className : 'clickable',
          art : 'https://www.dropbox.com/s/9bc2abxgw1hodxx/mosquito_tiltbrush_chach.glb?dl=0',
          scale : {
            x : 3,
            y : 3,
            z : 3
          },
          rotation : {
            x : 0,
            y : 90,
            z : 0
          },
          position : {
            x : 2,
            y : 2,
            z : 3
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

export let Scene = {
  scene: 7,
  published: true,
  id: "texture_example_2",
  name: "Textures",
  duration: 60000,
  autoPlay: false,
  camera_2: {
    camera: {
      name: "World camera",
      id: "camera_scale_texture",
      cursorCamera: false,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
    },
  },
  light: {
    light: {
      type: 'ambient',
      position: {
        x: 1,
        y: 1,
        z: 1,
      },
      color: '#ffffff',
    }
  },
  title: {
    text: {
      id: "message_texture",
      text: "value: Testing out transparency with obj; width: 10; color: #000000;",
      scale: {
        x: 1,
        y: 1,
        z: 1
      },
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      position: {
        x: -5,
        y: 0,
        z: -5,
      }
    }
  },
  heart_obj: {
    mesh: {
      name: "Heart",
      credit: "Sarah Chalek",
      id: "heart-obj",
      art: "https://www.dropbox.com/s/7npa0fpnsl0nkgs/heart_plane_test_blender.obj?dl=0",
      // art: "https://www.dropbox.com/s/syjpoyk305zq2a2/ladybug.obj?dl=0",
      // material: "https://www.dropbox.com/s/1t98l8tlcegh4cj/heart_plane_test_blender.mtl?dl=0",
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: -10,
        z: -2
      },
      texture: {
        alphaTest: 0.5,
        src: "https://www.dropbox.com/s/vjtsdo7leto00g8/heart_diffuse_color_alpha.png?dl=0",
        alphaMap: "https://www.dropbox.com/s/c8e9bbmc7pws0f2/heart_alpha.png?dl=0",
        repeatScale: {
          u: 3,
          v: 3
        },
      }
    },
  },
    leaf_obj: {
      mesh: {
        name: "Leaf",
        credit: "Chacha Sikes",
        id: "leaf-obj",
        art: "https://www.dropbox.com/s/7npa0fpnsl0nkgs/heart_plane_test_blender.obj?dl=0",
        // art: "https://www.dropbox.com/s/syjpoyk305zq2a2/ladybug.obj?dl=0",
        // material: "https://www.dropbox.com/s/1t98l8tlcegh4cj/heart_plane_test_blender.mtl?dl=0",
        scale: {
          x: 0.2,
          y: 0.2,
          z: 0.2,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        position: {
          x: 2,
          y: 0,
          z: -3
        },
        texture: {
          src: "https://www.dropbox.com/s/d2u705tszx6pkj8/leaf_color_alpha.png?dl=0",
          alphaMap: "https://www.dropbox.com/s/pqx3thl7u7iczdv/leaf_alpha.png?dl=0",
          alphaTest: 0.5,
          repeatScale: {
            u: 3,
            v: 3
          },
        }
      },
  }


};

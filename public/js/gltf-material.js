AFRAME.registerComponent('gltf-material', {
    schema: {
      path: {default: ''},
      normalPath: {default: null},
      bumpPath: {default: null},
      alphaPath: {default: null},
      displacementPath: {default: null},
      roughnessPath: {default: null},
      environmentPath: {default: null},
      emissivePath: {default: null},
      lightMapPath: {default: null},
      ambientOcculsionPath: {default: null},
      opacity: {default: null},
      extension: {default: 'jpg'},
      format: {default: 'RGBFormat'},
      enableBackground: {default: false}
    },
    init: function() {
      const data = this.data;
      var el = this.el;

      let materialSettings = {};
      // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial

      let scale = {
        u: 8,
        v: 8
      }

      materialSettings.metalness = 0;
      if (data.opacity !== null) {
        materialSettings.opacity = typeof data.opacity === 'string' ? parseFloat(data.opacity) : data.opacity;
      }

      if (data.path !== undefined) {
        var baseTexture = new THREE.TextureLoader().load(data.path);
        baseTexture.wrapS = THREE.RepeatWrapping;
        baseTexture.wrapT = THREE.RepeatWrapping;
        baseTexture.repeat.set(scale.u, scale.v);
        materialSettings.map = baseTexture;
      }

      if (data.normalPath !== undefined) {
        var normalPathTexture = new THREE.TextureLoader().load(data.normalPath);
        normalPathTexture.wrapS = THREE.RepeatWrapping;
        normalPathTexture.wrapT = THREE.RepeatWrapping;
        normalPathTexture.repeat.set(scale.u, scale.v);
        materialSettings.normalMap = normalPathTexture;
      }

      if (data.bumpPath !== null) {
        var bumpTexture = new THREE.TextureLoader().load(data.bumpPath);
        bumpTexture.wrapS = THREE.RepeatWrapping;
        bumpTexture.wrapT = THREE.RepeatWrapping;
        bumpTexture.repeat.set(scale.u, scale.v);
        materialSettings.bumpMap = bumpTexture;
        materialSettings.bumpScale = 0.5;
      }

      if (data.alphaPath !== null) {
        var alphaTexture = new THREE.TextureLoader().load(data.alphaPath);
        alphaTexture.wrapS = THREE.RepeatWrapping;
        alphaTexture.wrapT = THREE.RepeatWrapping;
        alphaTexture.repeat.set(scale.u, scale.v);
        materialSettings.alphaMap = alphaTexture;
      }

      if (data.displacementPath !== null) {
        var displacementTexture = new THREE.TextureLoader().load(data.displacementPath);
        displacementTexture.wrapS = THREE.RepeatWrapping;
        displacementTexture.wrapT = THREE.RepeatWrapping;
        displacementTexture.repeat.set(scale.u, scale.v);
        materialSettings.displacementMap = displacementTexture;
        // materialSettings.displacementScale = 0.5;
      }

      if (data.environmentPath !== null) {
        var environmentTexture = new THREE.TextureLoader().load(data.environmentPath);
        environmentTexture.wrapS = THREE.RepeatWrapping;
        environmentTexture.wrapT = THREE.RepeatWrapping;
        environmentTexture.repeat.set(scale.u, scale.v);
        materialSettings.envMap = environmentTexture;
        // materialSettings.envMapIntensity = 2;
      }

      if (data.emissivePath !== null) {
        var emissiveTexture = new THREE.TextureLoader().load(data.emissivePath);
        emissiveTexture.wrapS = THREE.RepeatWrapping;
        emissiveTexture.wrapT = THREE.RepeatWrapping;
        emissiveTexture.repeat.set(scale.u, scale.v);
        materialSettings.emissiveMap = emissiveTexture;
      }

      if (data.ambientOcculsionPath !== null) {
        var ambientOcculsionTexture = new THREE.TextureLoader().load(data.ambientOcculsionPath);
        materialSettings.aoMap = ambientOcculsionTexture;
        materialSettings.aoMapIntensity = 0.1;
      }
      //
      if (data.roughnessPath !== null) {
        var roughnessTexture = new THREE.TextureLoader().load(data.roughnessPath);
        roughnessTexture.wrapS = THREE.RepeatWrapping;
        roughnessTexture.wrapT = THREE.RepeatWrapping;
        roughnessTexture.repeat.set(scale.u, scale.v);
        materialSettings.roughnessMap = roughnessTexture;
      }

      if (data.lightMapPath !== null) {
        var lightMapTexture = new THREE.TextureLoader().load(data.lightMapPath);
        materialSettings.lightMap = lightMapTexture;
      }





      // materialSettings.emissive = #ffffff;
      // materialSettings.emissiveIntensity = 0.3;
      this.material = new THREE.MeshStandardMaterial(materialSettings);

      this.el.addEventListener('model-loaded', () => this.update());
    },
    update: function() {
      object = this.el.getObject3D('mesh');
      if (!object) return;
      object.traverse((node) => {
        if (node !== undefined && node.isMesh) node.material = this.material;
      });
    }
  }
);

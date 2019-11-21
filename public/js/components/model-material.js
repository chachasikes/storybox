export function registerComponent() {
  if (AFRAME.components["model-material"] === undefined) {
  AFRAME.registerComponent('model-material', {
      schema: {
        path: {default: ''},
        src: {default: ''},
        normalMap: {default: null},
        bumpMap: {default: null},
        alphaMap: {default: null},
        displacementMap: {default: null},
        roughnessMap: {default: null},
        environmentMap: {default: null},
        emissiveMap: {default: null},
        lightMapMap: {default: null},
        ambientOcculsionMap: {default: null},
        opacity: {default: null},
        extension: {default: 'jpg'},
        format: {default: 'RGBFormat'},
        enableBackground: {default: false},
        repeatScaleU: {default: 1},
        repeatScaleV: {default: 1},
        colorWrite: {default: null},
        alphaTest:  {default: null},
        transparent: {default: null},
        roughness: {default: null},
        metalness: {default: null},
        color: {default: null},
      },
      multiple: true,
      init: function() {
        const data = this.data;
        var el = this.el;

        let materialSettings = {};
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial

        let scale = {
          u: data.repeatScaleU,
          v: data.repeatScaleV
        }
        materialSettings.metalness = 0;
        if (data.opacity !== null) {
          materialSettings.opacity = typeof data.opacity === 'string' ? parseFloat(data.opacity) : data.opacity;
        }

        if (data.transparent !== null) {
          materialSettings.transparent = data.transparent;
        }

        if (data.alphaTest !== null) {
          materialSettings.alphaTest = data.alphaTest;
        }

        if (data.roughness !== null) {
          materialSettings.roughness = data.roughness;
        }

        if (data.metalness !== null) {
          materialSettings.metalness = data.metalness;
        }

        if (data.shader !== null) {
          materialSettings.shader = data.shader;
        }

        if (data.color !== null) {
          materialSettings.color = data.color;
          materialSettings.combine = THREE.NormalBlending;
        }

        if (data.path !== null && data.path !== '') {
          let baseTexture = new THREE.TextureLoader().load(data.path);
          baseTexture.wrapS = THREE.RepeatWrapping;
          baseTexture.wrapT = THREE.RepeatWrapping;
          baseTexture.repeat.set(scale.u, scale.v);
          // baseTexture.userData = { fitTo : 1 };
          materialSettings.map = baseTexture;
        }

        if (data.src !== null && data.src !== '') {
          let baseTexture = new THREE.TextureLoader().load(data.src);
          baseTexture.wrapS = THREE.RepeatWrapping;
          baseTexture.wrapT = THREE.RepeatWrapping;
          baseTexture.repeat.set(scale.u, scale.v);


          materialSettings.map = baseTexture;
        }

        if (data.normalMap !== null) {
          let normalMapTexture = new THREE.TextureLoader().load(data.normalMap);
          normalMapTexture.wrapS = THREE.RepeatWrapping;
          normalMapTexture.wrapT = THREE.RepeatWrapping;
          normalMapTexture.repeat.set(scale.u, scale.v);
          materialSettings.normalMap = normalMapTexture;
        }

        if (data.bumpMap !== null) {
          let bumpTexture = new THREE.TextureLoader().load(data.bumpMap);
          bumpTexture.wrapS = THREE.RepeatWrapping;
          bumpTexture.wrapT = THREE.RepeatWrapping;
          bumpTexture.repeat.set(scale.u, scale.v);
          materialSettings.bumpMap = bumpTexture;
          materialSettings.bumpScale = 0.5;
        }

        if (data.alphaMap !== null) {
          let alphaTexture = new THREE.TextureLoader().load(data.alphaMap);
          alphaTexture.wrapS = THREE.RepeatWrapping;
          alphaTexture.wrapT = THREE.RepeatWrapping;
          alphaTexture.repeat.set(scale.u, scale.v);
          materialSettings.alphaMap = alphaTexture;
        }

        if (data.displacementMap !== null) {
          let displacementTexture = new THREE.TextureLoader().load(data.displacementMap);
          displacementTexture.wrapS = THREE.RepeatWrapping;
          displacementTexture.wrapT = THREE.RepeatWrapping;
          displacementTexture.repeat.set(scale.u, scale.v);
          materialSettings.displacementMap = displacementTexture;
          // materialSettings.displacementScale = 0.5;
        }

        if (data.environmentMap !== null) {
          let environmentTexture = new THREE.TextureLoader().load(data.environmentMap);
          environmentTexture.wrapS = THREE.RepeatWrapping;
          environmentTexture.wrapT = THREE.RepeatWrapping;
          environmentTexture.repeat.set(scale.u, scale.v);
          materialSettings.envMap = environmentTexture;
          // materialSettings.envMapIntensity = 2;
        }

        if (data.emissiveMap !== null) {
          let emissiveTexture = new THREE.TextureLoader().load(data.emissiveMap);
          emissiveTexture.wrapS = THREE.RepeatWrapping;
          emissiveTexture.wrapT = THREE.RepeatWrapping;
          emissiveTexture.repeat.set(scale.u, scale.v);
          materialSettings.emissiveMap = emissiveTexture;
        }

        if (data.ambientOcculsionMap !== null) {
          let ambientOcculsionTexture = new THREE.TextureLoader().load(data.ambientOcculsionMap);
          materialSettings.aoMap = ambientOcculsionTexture;
          materialSettings.aoMapIntensity = 0.1;
        }
        //
        if (data.roughnessMap !== null) {
          let roughnessTexture = new THREE.TextureLoader().load(data.roughnessMap);
          roughnessTexture.wrapS = THREE.RepeatWrapping;
          roughnessTexture.wrapT = THREE.RepeatWrapping;
          roughnessTexture.repeat.set(scale.u, scale.v);
          materialSettings.roughnessMap = roughnessTexture;
        }

        if (data.lightMapMap !== null) {
          let lightMapTexture = new THREE.TextureLoader().load(data.lightMapMap);
          materialSettings.lightMap = lightMapTexture;
        }

        // materialSettings.emissive = #ffffff;
        // materialSettings.emissiveIntensity = 0.3;
        this.material = new THREE.MeshStandardMaterial(materialSettings);

        this.el.addEventListener('model-loaded', () => {
          console.log('update model-material: loaded');

          this.update();
        });
      },
      update: function() {
        let object;
        if (this.el !== undefined) {
          object = this.el.getObject3D('mesh');
          if (!object) return;
          object.scale.set( 1, 1, 1 );
          // console.log('mat', this.material);
          object.traverse((node) => {
            if (node !== undefined && node.isMesh) {

              node.material = this.material;
              if (node.material.map) {
                // node.material.map.encoding = THREE.sRGBEncoding;
                // node.material.needsUpdate = true;

              }
            }
          });
        }
      },
      remove: function () {
        var data = this.data;
        var el = this.el;

        // Remove event listener.
        if (data.event) {
          el.removeEventListener(data.event, this.eventHandlerFn);
        }
      }
    }
  );
}
}

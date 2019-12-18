export function registerComponent() {
  if (AFRAME.components["tiltbrush-material"] === undefined) {
  AFRAME.registerComponent('tiltbrush-material', {
      schema: {
      },
      init: function() {
        let object;
        this.time = 0;
        if (this.el !== undefined) {
          let material = this.animatedMaterial();
          this.material = material;
          this.el.addEventListener('model-loaded', () => {
            this.update();
          });
        }
      },
      update: function() {
        this.time++;
        if (this.el !== undefined) {
          let object;
          object = this.el.getObject3D('mesh');
          // execute this code every frame
          if (object !== undefined) {
            object.renderOrder = 0;
            if (!object) return;
            object.scale.set(1,1,1);
            object.traverse((node) => {
              if (node !== undefined && node.isMesh) {
                node.material = this.material;
                node.material.alphaMap.offset.y = this.time * 0.0015;
                console.log(node.material.alphaMap.offset.y);
                if (node.material.map) {
                  // node.material.map.encoding = THREE.sRGBEncoding;
                  node.material.needsUpdate = true;
                }
              }
            });
          }
        }
      },
      remove: function () {
        var data = this.data;
        var el = this.el;

        // Remove event listener.
        if (data.event) {
          el.removeEventListener(data.event, this.eventHandlerFn);
        }
      },
      simpleMaterial: function() {
        let materialSettings = {};
        materialSettings.emissive = "#ffffff";
        materialSettings.emissiveIntensity = 0.3;
        return new THREE.MeshStandardMaterial(materialSettings);
      },
      animatedMaterial: function() {
        var material = new THREE.MeshStandardMaterial({
          color: "#444",
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.5,
          opacity: 1,
          roughness: 1
        });

        // this image is loaded as data uri. Just copy and paste the string contained in "image.src" in your browser's url bar to see the image.
        // alpha texture used to regulate transparency
        var image = document.createElement('img');
        var alphaMap = new THREE.Texture(image);
        image.onload = function()  {
          alphaMap.needsUpdate = true;
        };
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg==';
        material.alphaMap = alphaMap;
        material.alphaMap.magFilter = THREE.NearestFilter;
        material.alphaMap.wrapT = THREE.RepeatWrapping;
        material.alphaMap.repeat.y = 1;
        return material;
      }
    }
  );
}
}

export function registerComponent() {
  if (AFRAME.components["tiltbrush-material"] === undefined) {
  AFRAME.registerComponent('tiltbrush-material', {
      schema: {
      },
      init: function() {
        let object;
        this.time = 0;
        if (this.el !== undefined) {
          // let material = this.smokeMaterial();
          // this.material = material;
          this.el.addEventListener('model-loaded', () => {
            this.update();
          });
        }
      },
      update: function() {
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
                node.material = this.assignChildMaterials(node);
              //   node.material = this.material;
                // if (node.material.map) {
                //   // node.material.map.encoding = THREE.sRGBEncoding;
                //   node.material.needsUpdate = true;
                // }
              }
            });
          }
        }
      },
      tick: function() {
        this.time++;
        // var delta = clock.getDelta();
        if (this.el !== undefined) {
          let object;
          object = this.el.getObject3D('mesh');
          // execute this code every frame
          if (object !== undefined) {
            object.traverse((node) => {
              if (node !== undefined && node.isMesh) {
                this.updateChildMaterials(node);

                // if (node.material.map) {
                  // node.material.map.encoding = THREE.sRGBEncoding;
                  // node.material.needsUpdate = true;
                // }
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
      assignChildMaterials: function(node) {
        if (node !== undefined) {
          switch(node.material.name) {
            case "Smoke":
              return this.smokeMaterial(node);
              break;
            case "NeonPulse":
              return this.neonPulseMaterial(node);
              break;
            default:
              return node.material;
              break;
          }
        }
      },
      updateChildMaterials: function(node) {
        if (node !== undefined) {
          switch(node.material.name) {
            case "Smoke":
              	this.currentDisplayTime += this.time;
                if(node.material !== undefined) {
                  let material = node.material;
                  // console.log(material.currentDisplayTime, material.tileDisplayDuration);
                	while (material.currentDisplayTime > material.tileDisplayDuration) {
                		material.currentDisplayTime -= material.tileDisplayDuration;
                		material.currentTile++;
                		if (material.currentTile == material.numberOfTiles)
                			material.currentTile = 0;
                		var currentColumn = material.currentTile % material.tilesHorizontal;
                		material.texture.offset.x = currentColumn / material.tilesHorizontal;
                		var currentRow = Math.floor( material.currentTile / material.tilesHorizontal );
                		material.texture.offset.y = currentRow / material.tilesVertical;
                	}
                }
              break;
            case "NeonPulse":
              if(node.material.alphaMap !== undefined && node.material.alphaMap !== null) {
                node.material.alphaMap.offset.x = this.time * 0.0015;
              }
              break;
            default:
              return node.material;
              break;
          }
        }
      },
      simpleMaterial: function() {
        let materialSettings = {};
        materialSettings.emissive = "#ffffff";
        materialSettings.emissiveIntensity = 0.3;
        return new THREE.MeshStandardMaterial(materialSettings);
      },
      neonPulseMaterial: function(node) {
        var texture = new THREE.TextureLoader().load('./../../images/textures/tiltbrush/NeonPulse/maintexture.png');
        var material = new THREE.MeshStandardMaterial({
          color: node.material.color,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          alphaTest: 0.5,
          opacity: 1,
          roughness: 1,
          name: node.material.name,
          alphaMap: texture,
          vertexColors: THREE.VertexColors,
        });
        material.alphaMap.magFilter = THREE.NearestFilter;
        material.alphaMap.wrapT = THREE.RepeatWrapping;
        material.alphaMap.repeat.y = 1;
        return material;
      },
      smokeMaterial: function(node) {
        var texture = new THREE.ImageUtils.loadTexture('./../../images/textures/tiltbrush/Smoke/maintexture.png');
        var material = new THREE.MeshStandardMaterial({
          color: node.material.color,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.01,
          depthWrite: false,
          opacity: 1,
          roughness: 1,
          name: node.material.name,
          alphaMap: texture,
          vertexColors: THREE.VertexColors,
        });

        // texture, #horiz, #vert, #total, duration.
      	// var animatedTexture = new this.TextureAnimator(texture, 4, 4, 16, 55, material);
        // material.map = texture;
        return material;
    },
    TextureAnimator: function(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, material) {
      	// note: texture passed by reference, will be updated by the update function.
        // view-source:https://stemkoski.github.io/Three.js/Texture-Animation.html
      	material.tilesHorizontal = tilesHoriz;
      	material.tilesVertical = tilesVert;
      	// how many images does this spritesheet contain?
      	//  usually equals tilesHoriz * tilesVert, but not necessarily,
      	//  if there at blank tiles at the bottom of the spritesheet.
      	material.numberOfTiles = numTiles;
      	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      	texture.repeat.set( 1 / material.tilesHorizontal, 1 / material.tilesVertical );

      	// how long should each image be displayed?
      	material.tileDisplayDuration = tileDispDuration;

      	// how long has the current image been displayed?
      	material.currentDisplayTime = 0;

      	// which image is currently being displayed?
      	material.currentTile = 0;
    }
    });
  }
}

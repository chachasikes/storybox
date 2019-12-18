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
              // if(node.material.alphaMap !== undefined) {
              //   node.material.alphaMap.offset.x = this.time * 0.0015;
              //   node.material.alphaMap.offset.y = this.time * 0.0015;
              // }
              break;
            case "NeonPulse":
              if(node.material.alphaMap !== undefined) {
                node.material.alphaMap.offset.y = this.time * 0.0015;
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
        var material = new THREE.MeshStandardMaterial({
          color: "#444",
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.5,
          opacity: 1,
          roughness: 1,
          name: node.material.name
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
      },
      smokeMaterial: function(node) {
        var texture = new THREE.ImageUtils.loadTexture('../../images/textures/Smoke/maintexture.png');
      	// var animatedTexture = new TextureAnimator(texture, 4, 4, 16, 55 );

        var material = new THREE.MeshStandardMaterial({
          color: "#444",
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.5,
          opacity: 1,
          roughness: 1,
          name: node.material.name,
          // map: animatedTexture
        });

        // texture, #horiz, #vert, #total, duration.
      	// var explosionMaterial = new THREE.MeshBasicMaterial( { map: explosionTexture } );

        // this image is loaded as data uri. Just copy and paste the string contained in "image.src" in your browser's url bar to see the image.
        // alpha texture used to regulate transparency
        // var image = document.createElement('img');
        // var alphaMap = new THREE.Texture(image);
        // image.onload = function()  {
        //   alphaMap.needsUpdate = true;
        // };
        // image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg==';
        // material.alphaMap = alphaMap;
        // material.alphaMap.magFilter = THREE.NearestFilter;
        // material.alphaMap.wrapT = THREE.RepeatWrapping;
        // material.alphaMap.repeat.y = 1;
        return material;
    },
    textureAnimator: function(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
      	// note: texture passed by reference, will be updated by the update function.
        // view-source:https://stemkoski.github.io/Three.js/Texture-Animation.html
      	// this.tilesHorizontal = tilesHoriz;
      	// this.tilesVertical = tilesVert;
      	// // how many images does this spritesheet contain?
      	// //  usually equals tilesHoriz * tilesVert, but not necessarily,
      	// //  if there at blank tiles at the bottom of the spritesheet.
      	// this.numberOfTiles = numTiles;
      	// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      	// texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
        //
      	// // how long should each image be displayed?
      	// this.tileDisplayDuration = tileDispDuration;
        //
      	// // how long has the current image been displayed?
      	// this.currentDisplayTime = 0;
        //
      	// // which image is currently being displayed?
      	// this.currentTile = 0;
        //
      	// this.update = function( milliSec ) {
      	// 	this.currentDisplayTime += milliSec;
      	// 	while (this.currentDisplayTime > this.tileDisplayDuration)
      	// 	{
      	// 		this.currentDisplayTime -= this.tileDisplayDuration;
      	// 		this.currentTile++;
      	// 		if (this.currentTile == this.numberOfTiles)
      	// 			this.currentTile = 0;
      	// 		var currentColumn = this.currentTile % this.tilesHorizontal;
      	// 		texture.offset.x = currentColumn / this.tilesHorizontal;
      	// 		var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
      	// 		texture.offset.y = currentRow / this.tilesVertical;
      	// 	}
      	// }
      }
    }
  );
  }
}

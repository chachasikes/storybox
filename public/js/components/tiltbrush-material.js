export function registerComponent() {
  if (AFRAME.components["tiltbrush-material"] === undefined) {
  AFRAME.registerComponent('tiltbrush-material', {
      schema: {
      },
      init: function() {
        let object;
        this.time = 0;
        if (this.el !== undefined) {
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
                // console.log(node.material.name);
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
          node.time = 0;
          // console.log(node.material.name);
          let materialName = node.material.name;
          let materialNameUnique = materialName.replace(/[0-9]/g, '');

          switch(materialNameUnique) {
            case "brush_Smoke":
            case "Smoke":
              return this.smokeMaterial(node);
              break;
            case "brush_NeonPulse":
            case "NeonPulse":
              return this.neonPulseMaterial(node);
              break;
            case "brush_Rainbow":
            case "Light":
            case "brush_Light":
            case "brush_Fire":
            case "brush_Electricity":
            case "brush_Comet":
            case "brush_Stars":
              return this.tiltbrushMaterial(node, {emissive: true, emissiveIntensity: 1});
              break;
            case "Bubbles":
            case "brush_Bubbles":
            case "brush_DiamondHull":
            case "brush_Snow":
            case "brush_HyperGrid":
            case "brush_Embers":
            case "brush_Hypercolor":
            case "brush_Streamers":
            case "brush_Waveform":
            case "brush_Dots":
            case "brush_ChromaticWave":
            case "brush_SoftHighlighter":
            case "brush_Highlighter":
            case "brush_VelvetInk":
              return this.tiltbrushMaterial(node, {emissive: true, emissiveIntensity: 0.7, glow: true});
              break;
            case "brush_Petal":
            case "brush_Lofted":
            case "brush_Spikes":
            case "brush_DuctTape":
            case "brush_CelVinyl":
            case "brush_Wire":
            case "brush_Toon":
            case "brush_Ink":
            case "brush_Paper":
            case "brush_CoarseBristles":
            case "brush_Icing":
            case "brush_TaperedFlat":
            case "brush_DoubleTaperedMarker":
            case "brush_ThickPaint":
            case "brush_WetPaint":
            case "brush_Splatter":
              return this.tiltbrushMaterial(node, {emissive: true, emissiveIntensity: 0.3});
              break;
            case "brush_MatteHull":
            case "brush_UnlitHull":

              return this.tiltbrushMaterial(node, {flat: true});
              break;
            case "brush_WigglyGraphite":
            case "brush_Disco":
            case "brush_ShinyHull":
            default:
              return node.material;
              break;
          }
        }
      },
      updateChildMaterials: function(node) {
        node.time++;
        if (node !== undefined) {
          switch(node.material.name) {
            case "brush_Smoke":
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
            case "brush_NeonPulse":
            case "NeonPulse":
              if(node.material.alphaMap !== undefined && node.material.alphaMap !== null) {
                node.material.alphaMap.offset.x = this.getOffset(node, 0.001, node.material.alphaMap.offset.x);
                // node.material.alphaMap.offset.y = this.getOffset(node, 0.001, node.material.alphaMap.offset.y);
              }
              break;
            case "brush_Light":
            case "Light":

              break;
            case "brush_Bubbles":
            case "Bubbles":
              break;
            default:

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
      getOffset: function(node, increment, offset) {
        if (offset > 1) {
          node.time = 0;
        }
        let value = node.time * increment;
        return value;
      },
      neonPulseMaterial: function(node) {
        var texture = new THREE.TextureLoader().load('./../../images/textures/tiltbrush/NeonPulse/stripes.png');
        var material = new THREE.MeshStandardMaterial({
          color: node.material.color,
          // transparent: true,
          // side: THREE.DoubleSide,
          depthWrite: false,
          alphaTest: 1,
          opacity: 1,
          roughness: 0.5,
          metalness: 0.5,
          name: node.material.name,
          vertexColors: THREE.VertexColors,
          alphaMap: texture,
          flatShading: false,
        });
        // if (node.material.texture !== undefined && node.material.texture !== null) {
          material.alphaMap.magFilter = THREE.NearestFilter;
          material.alphaMap.wrapT = THREE.RepeatWrapping;
          material.alphaMap.repeat.y = 1;

          material.emissiveMap = texture;
          material.emissive = node.material.color;
          material.emissiveIntensity = 0.5;
        // }

        return material;
      },
      smokeMaterial: function(node) {
        var texture = new THREE.TextureLoader().load('./../../images/textures/tiltbrush/Smoke/maintexture.png');
        var material = new THREE.MeshStandardMaterial({
          color: node.material.color,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.01,
          depthWrite: false,
          opacity: 1,
          roughness: 1,
          name: node.material.name,
          vertexColors: THREE.VertexColors,
          alphaMap: texture
        });

        // texture, #horiz, #vert, #total, duration.
      	// var animatedTexture = new this.TextureAnimator(texture, 4, 4, 16, 55, material);
        // material.map = texture;
        return material;
    },
    tiltbrushMaterial: function(node, options) {
      // console.log(node.material);
      var material = new THREE.MeshStandardMaterial({
        color: node.material.color,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.5,
        depthWrite: false,
        opacity: 1,
        roughness: 1,
        name: node.material.name,
        vertexColors: THREE.VertexColors,
      });

      if (node.material.map !== undefined && node.material.map !== null) {
        let textureFile = node.material.map.image.currentSrc;
        var texture = new THREE.TextureLoader().load(textureFile);
        console.log(texture, node.material.name);
        if (texture !== undefined) {
          material.alphaMap = texture;
        }


      if (options.emissive === true) {
        material.emissiveMap = texture;
        material.emissive = node.material.color;
        material.emissiveIntensity = options.emissiveIntensity;
      }
    } else {

    }
      // console.log(material);

      return material;
    },
    TextureAnimator: function(texture, tilesHoriz, tilesVert, numTiles, tileDisplayDuration, material) {
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
      	material.tileDisplayDuration = tileDisplayDuration;

      	// how long has the current image been displayed?
      	material.currentDisplayTime = 0;

      	// which image is currently being displayed?
      	material.currentTile = 0;
    }
    });
  }
}

export function registerComponent() {
  if (AFRAME.components["glow-material"] === undefined) {
  AFRAME.registerComponent('glow-material', {
      schema: {
        enabled: {default: true},
        c: {type: 'number', default: 1 },
        p: {type: 'number', default: 1.4 },
        color: {type: 'color', default: '#FFFF00'},
        scale: {type: 'number', default: 2 },
        side: {type: 'string', default: "front" },
      },
      init: function() {
        let object;
        this.time = 0;
        if (this.el !== undefined) {
          this.el.addEventListener('model-loaded', (e) => {
            this.update(e);
          });
        }
      },
      update: function(e) {
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
                node.material = this.assignChildMaterials(node, e);
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
      assignChildMaterials: function(node, e) {
        if (node !== undefined) {
          node.time = 0;
          // console.log(node.material.name);
          let materialName = node.material.name;
          let materialNameUnique = materialName.replace(/[0-9]/g, '').replace('.', '');
          // console.log(materialNameUnique);
          switch(materialNameUnique) {
            case "brush_Smoke":
            case "Smoke":
            case "brush_NeonPulse":
            case "NeonPulse":
            case "brush_Rainbow":
            case "Light":
            case "brush_Light":
            case "brush_Fire":
            case "brush_Electricity":
            case "brush_Comet":
            case "brush_Stars":
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
            case "brush_MatteHull":
            case "brush_UnlitHull":
            case "brush_WigglyGraphite":
            case "brush_Disco":
            case "brush_ShinyHull":
            case "Material":
              return this.tiltbrushMaterial(node, {visible: true, emissive: true, emissiveIntensity: 1, glow: true}, e);
            default:
              return node.material;
            break;
          }
        }
      },
      updateChildMaterials: function(node) {
      },
      tiltbrushMaterial: function(node, options = {}, e) {
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
          if (texture !== undefined) {
            material.alphaMap = texture;
          }
        }

        if (options.emissive === true) {
          material.emissiveMap = texture;
          material.emissive = new THREE.Color(node.material.color.r, node.material.color.g, node.material.color.b);
          material.emissiveIntensity = options.emissiveIntensity;
        }

        if (options.glow === true) {
          this.glowMaterial(node, {}, e);
        }

      return material;
    },
    glowMaterial: function(node, options = {}, e) {
      let camera = document.querySelector('a-camera');
      let color = this.data.color !== null ? new THREE.Color(this.data.color) : node.material.color;
      // console.log(color);
      // view-source:https://stemkoski.github.io/Three.js/Shader-Glow.html
      var customMaterial = new THREE.ShaderMaterial({
	    uniforms: {
    			"c":   { type: "f", value: 1.0 },
    			"p":   { type: "f", value: 1.4 },
    			glowColor: { type: "c", value: new THREE.Color(0xffff00) },
    			viewVector: { type: "v3", value: camera.position }
    		},
        vertexShader: `
          varying vec2 vUv;
          uniform vec3 viewVector;
          uniform float c;
          uniform float p;
          varying float intensity;

          void main() {
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * viewVector );
            intensity = pow( c - dot(vNormal, vNormel), p );

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4( glow, 1.0 );

            // float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );
      	    // gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
          }
        `,
    		side: THREE.FrontSide,
    		blending: THREE.AdditiveBlending,
    		transparent: true
	     });


      // var model = node;
      // // console.log(node.name);
      // var subset = model.getObjectByName(node.name);
      // console.log(subset);
      // var clone = new THREE.Mesh(subset.clone(), customMaterial);
      // clone.position.set(node.position.x, node.position.y, node.position.z);
      // // // clone.rotation.set(node.rotation.x, node.rotation.y, node.rotation.z);
      // // console.log(clone.position);
      // this.el.setObject3D('mesh', clone);


      //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0xffcc00 } );
      var mesh = new THREE.Mesh( node.geometry, material );
      let parentEl = document.querySelector(`#${this.el.id}`);
      // console.log(parentEl);
      let childEl = document.createElement('a-entity');
      let scene = document.querySelector('a-scene');
      childEl.setObject3D('mesh', mesh);
      childEl.object3D.position.set(node.position.x, node.position.y, node.position.z);
      childEl.object3D.rotation.set(node.rotation.x, node.rotation.y, node.rotation.z);
      childEl.object3D.scale.set(node.scale.x, node.scale.y, node.scale.z);
      scene.appendChild(childEl);


    },
  });
}
}

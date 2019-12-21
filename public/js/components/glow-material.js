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
          console.log(node);
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
            case "": // default
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

      var camera = document.querySelector('[camera]').object3D;
      this.camera = camera;
      var sideRender = THREE.FrontSide;
      if (this.data.side === "back") {
        sideRender = THREE.BackSide;
      }

      if (this.data.c < 0) { this.data.c = 0; }
      if (this.data.c > 1) { this.data.c = 1; }
      if (this.data.p < 0) { this.data.p = 0; }
      if (this.data.p > 6) { this.data.p = 6; }
      // this.glowShaderMaterial.material.uniforms.glowColor.value.setHex( this.data.color.replace("#", "0x"));
      // Setup shader
    	this.glowShaderMaterial = new THREE.ShaderMaterial({
    	    uniforms: {
    			"c":   { type: "f", value: this.data.c },
    			"p":   { type: "f", value: this.data.p },
    			glowColor: { type: "c", value: new THREE.Color(this.data.color) },
    			viewVector: { type: "v3", value: camera.position }
    		},
    		vertexShader:   THREE.__GlowShader.vertexShader,
    		fragmentShader: THREE.__GlowShader.fragmentShader,
    		side: sideRender,
    		blending: THREE.AdditiveBlending,
    		transparent: true,
        // vertexColors: THREE.VertexColors
    	});

      var object = node.geometry;
      console.log(object);
      if (object !== undefined) {
        let node = object.clone();
        this.applyGlowMaterial(node);
      } else {
          mesh.traverse((node) => {
            if (node.geometry !== undefined) {
              let child = node.geometry.clone();
              this.applyGlowMaterial(child);
            }
          });
      }
    },
    applyGlowMaterial(object) {
console.log(object);


      object = new THREE.Geometry().fromBufferGeometry(object);
      var modifier = new THREE.BufferSubdivisionModifier( 3 );
      object = modifier.modify( object );

      object.glowMesh = new THREE.Mesh( object, this.glowShaderMaterial);
      object.glowMesh.rotation.set(this.el.object3D.rotation.x, this.el.object3D.rotation.y, this.el.object3D.rotation.z);
      object.glowMesh.scale.set(this.el.object3D.scale.x*this.data.scale, this.el.object3D.scale.y*this.data.scale, this.el.object3D.scale.z*this.data.scale);


      if (!this.data.enabled) {
       object.glowMesh.visible = false;
      }
// console.log(object);
      this.el.object3D.add( object.glowMesh );
      // console.log(this.el.object3D);
    }
  });
}
}


THREE.__GlowShader = {


//view-source:http://stemkoski.github.io/Three.js/Shader-Halo.html
	vertexShader: [

    "uniform vec3 viewVector;",
    "uniform float c;",
    "uniform float p;",
    "varying float intensity;",
    "void main() ",
    "{",
      "vec3 vNormal = normalize( normalMatrix * normal );",
    	"vec3 vNormel = normalize( normalMatrix * viewVector );", // Not using, if used this makes a bubble/shell effect.
    	"intensity = pow( c - dot(vNormal, vec3( 0.0, 0.0, 1.0 )), p );",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 glowColor;",
    "varying float intensity;",
    "void main() ",
    "{",
    	"vec3 glow = glowColor * intensity;",
      "gl_FragColor = vec4( glow, 1.0 );",
    "}"

	].join("\n")

};

export function registerComponent() {
   if (AFRAME.components["storybox-material"] === undefined) {
  AFRAME.registerComponent('storybox-material', {
      schema: {
        enabled: {default: true},
        c: {type: 'number', default: 1 },
        p: {type: 'number', default: 1.4 },
        color: {type: 'color', default: '#FFFF00'},
        glowScale: {type: 'number', default: 2 },
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
          console.log(materialNameUnique);
          switch(materialNameUnique) {
            case "brush_Smoke":
            case "Smoke":
              return this.smokeMaterial(node);
              break;
            case "brush_NeonPulse":
            case "NeonPulse":
              return this.neonPulseMaterial(node);
              break;
              //https://github.com/googlevr/tilt-brush-toolkit/tree/master/UnitySDK/Assets/TiltBrush/Assets/Brushes/Basic/Light
            case "brush_Rainbow":
            case "Light":
            case "brush_Light":
            case "cdbaaeecaefeed_brush_Light":
              return this.tiltbrushMaterial(node, {visible: true, emissive: true, transparent: true, alphaTest: 1, emissiveIntensity: 0.5, glow: true});
              break;
            case "brush_Fire":
            case "brush_Electricity":
            case "brush_Comet":
            case "brush_Stars":
              return this.tiltbrushMaterial(node, {emissive: true, emissiveIntensity: 1, glow: true});
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
              return this.tiltbrushMaterial(node, {emissive: true, emissiveIntensity: 0.7, transparent: false});
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
              return this.tiltbrushMaterial(node, {emissive: true, emissiveIntensity: 0.1, transparent: false});
              break;
            case "brush_MatteHull":
            case "brush_UnlitHull":
            case "deeceaa_brush_MatteHull":

              return this.tiltbrushMaterial(node, {transparent: false});
              break;
            case "brush_WigglyGraphite":
            case "brush_Disco":
            case "brush_ShinyHull":
              return this.tiltbrushMaterial(node);
              break;
            default:
              return node.material;
              break;
          }
        }
      },
      updateChildMaterials: function(node) {
      },
      tiltbrushMaterial: function(node, options = {}, e) {




        if (options.glow === true) {
          var material = new THREE.MeshStandardMaterial({
            color: node.material.color,
            // transparent: options.transparent ? options.transparent : false,
            // side: options.side ? options.side : 'front',
            // alphaTest: 0.1,
            // depthWrite: false,
            // opacity: options.opacity ? options.opacity : 1,
            // roughness: options.roughness ? options.roughness : 1,
            name: node.material.name,
            vertexColors: THREE.VertexColors,
            blending: THREE.MultiplyBlending,
          });

          if (node.material.map !== undefined && node.material.map !== null) {
            let textureFile = node.material.map.image.currentSrc;
            var texture = new THREE.TextureLoader().load(textureFile);
            if (texture !== undefined) {
              material.map = texture;
              // material.alphaMap = texture;
            }
          }

          if (options.emissive === true) {
            material.emissiveMap = texture;
            material.emissive = new THREE.Color(node.material.color.r, node.material.color.g, node.material.color.b);
            material.emissiveIntensity = 1;
          }

          // this.glowMaterial(node, {}, e);
        } else {
          var material = new THREE.MeshStandardMaterial({
            color: node.material.color,
            transparent: options.transparent ? options.transparent : false,
            side: options.side ? options.side : 'front',
            alphaTest: options.alphaTest ? options.alphaTest : 1,
            depthWrite: false,
            opacity: options.opacity ? options.opacity : 1,
            roughness: options.roughness ? options.roughness : 1,
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
        }

      return material;
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
    			glowColor: { type: "c", value: new THREE.Color(this.data.color) },//not using anymore
    			viewVector: { type: "v3", value: camera.position }
    		},
    		vertexShader:   THREE.__GlowShader.vertexShader,
    		fragmentShader: THREE.__GlowShader.fragmentShader,
    		side: sideRender,
    		blending: THREE.AdditiveBlending,
    		transparent: true,
        vertexColors: THREE.VertexColors
    	});
      console.log(node);

      var object = node.geometry;
      if (object !== undefined && object.clone !== undefined) {
        try {
          let child = object.clone();
          if (child !== undefined) {
            this.applyGlowMaterial(child, node, false);
          }
        } catch (error) {
          console.error(error);
          // console.log(child);
          console.log(object);
        }
      } else {
        mesh.traverse((node) => {
          try {
          if (node.geometry !== undefined && node.geometry.clone !== undefined) {
            let child = node.geometry.clone();
            if (child !== undefined) {
              this.applyGlowMaterial(child, node, true);
            }
          }
          } catch (error) {
            console.error(error);
            console.log(child);
          }
        });
      }
    },
    applyGlowMaterial(object, parent, isChild) {

      object = new THREE.Geometry().fromBufferGeometry(object);
      var modifier = new THREE.BufferSubdivisionModifier( 3 );
      object = modifier.modify( object );
      object.glowMesh = new THREE.Mesh( object, this.glowShaderMaterial);
        if (isChild === true){
        object.glowMesh.rotation.set(this.el.object3D.rotation.x, this.el.object3D.rotation.y, this.el.object3D.rotation.z);
        object.glowMesh.scale.set(this.el.object3D.scale.x*this.data.glowScale, this.el.object3D.scale.y*this.data.glowScale, this.el.object3D.scale.z*this.data.glowScale);
        if (parent !== null ) {
          //@todo position is wrong
          object.glowMesh.position.set(parent.position.x, parent.position.y, parent.position.z);
          // object.glowMesh.position.set(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);

        }
      }

      if (!this.data.enabled) {
       object.glowMesh.visible = false;
      }
      this.el.object3D.add( object.glowMesh );
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
    "varying vec3 vColor;",
    "void main() ",
    "{",
      "vec3 vNormal = normalize( normalMatrix * normal );",
    	"vec3 vNormel = normalize( normalMatrix * viewVector );", // Not using, if used this makes a bubble/shell effect.
    	// "intensity = vec3( 1.0, 1.0, 1.0 );",//pow( c - dot(vNormal, vec3( 0.0, 0.0, 1.0 )), p );
      "intensity = pow( c - dot(vNormal, vec3( 0.0, 0.0, 1.0 )), p );",//pow( c - dot(vNormal, vec3( 0.0, 0.0, 1.0 )), p );

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 glowColor;",
    "varying vec3 vColor;",
    "varying float intensity;",
    "void main() ",
    "{",
    	"vec3 glow = glowColor * intensity;",
      "gl_FragColor = vec4( glow, 1.0 );",
    "}"

	].join("\n")

};




/*
 * @author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 * @author Matthew Adams / http://www.centerionware.com - added UV support and rewrote to use buffergeometry.
 *
 * Subdivision Geometry Modifier using Loop Subdivision Scheme for Geometry / BufferGeometry
 *
 * References:
 *	http://graphics.stanford.edu/~mdfisher/subdivision.html
 *	http://www.holmes3d.net/graphics/subdivision/
 *	http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
 *
 * Known Issues:
 *	- currently doesn't handle "Sharp Edges"
 *	- no checks to prevent breaking when uv's don't exist.
 *	- vertex colors are unsupported.
 *	**DDS Images when using corrected uv's passed to subdivision modifier will have their uv's flipy'd within the correct uv set
 *	**Either flipy the DDS image, or use shaders. Don't try correcting the uv's before passing into subdiv (eg: v=1-v).
 *
 * @input THREE.Geometry, or index'd THREE.BufferGeometry with faceUV's (Not vertex uv's)
 * @output non-indexed vertex points, uv's, normals.
 *
 * The TypedArrayHelper class is designed to assist managing typed arrays, and to allow the removal of all 'new Vector3, new Face3, new Vector2'.
 *
 * It will automatically resize them if trying to push a new element to an array that isn't long enough
 * It provides 'registers' that the units can be mapped to. This allows a small set of objects
 * (ex: vector3's, face3's, vector2's) to be allocated then used, to eliminate any need to rewrite all
 * the features those classes offer while not requiring some_huge_number to be allocated.
 * It should be moved into it's own file honestly, then included before the BufferSubdivisionModifier - maybe in three's core?
 *
 */

THREE.Face3.prototype.set = function( a, b, c ) {

	this.a = a;
	this.b = b;
	this.c = c;

};

var TypedArrayHelper = function( size, registers, register_type, array_type, unit_size, accessors ) {

	this.array_type = array_type;
	this.register_type = register_type;
	this.unit_size = unit_size;
	this.accessors = accessors;
	this.buffer = new array_type( size * unit_size );
	this.register = [];
	this.length = 0;
	this.real_length = size;
	this.available_registers = registers;

	for ( var i = 0; i < registers; i++ ) {

		this.register.push( new register_type() );

	}

};

TypedArrayHelper.prototype = {

	constructor: TypedArrayHelper,

	index_to_register: function( index, register, isLoop ) {

		var base = index * this.unit_size;

		if ( register >= this.available_registers ) {

			throw new Error( 'THREE.BufferSubdivisionModifier: Not enough registers in TypedArrayHelper.' );

		}

		if ( index > this.length ) {

			throw new Error( 'THREE.BufferSubdivisionModifier: Index is out of range in TypedArrayHelper.' );

		}

		for ( var i = 0; i < this.unit_size; i++ ) {

			( this.register[ register ] )[ this.accessors[ i ] ] = this.buffer[ base + i ];

		}

	},

	resize: function( new_size ) {

		if ( new_size === 0 ) {

			new_size = 8;

		}

		if ( new_size < this.length ) {

			this.buffer = this.buffer.subarray( 0, this.length * this.unit_size );

		} else {

			var nBuffer;

			if ( this.buffer.length < new_size * this.unit_size ) {

				nBuffer = new this.array_type( new_size * this.unit_size );
				nBuffer.set( this.buffer );
				this.buffer = nBuffer;
				this.real_length = new_size;

			} else {

				nBuffer = new this.array_type( new_size * this.unit_size );
				nBuffer.set( this.buffer.subarray( 0, this.length * this.unit_size ) );
				this.buffer = nBuffer;
				this.real_length = new_size;

			}

		}

	},

	from_existing: function( oldArray ) {

		var new_size = oldArray.length;
		this.buffer = new this.array_type( new_size );
		this.buffer.set( oldArray );
		this.length = oldArray.length / this.unit_size;
		this.real_length = this.length;

	},

	push_element: function( vector ) {

		if ( this.length + 1 > this.real_length ) {

			this.resize( this.real_length * 2 );

		}

		var bpos = this.length * this.unit_size;

		for ( var i = 0; i < this.unit_size; i++ ) {

			this.buffer[ bpos + i ] = vector[ this.accessors[ i ] ];

		}

		this.length++;

	},

	trim_size: function() {

		if ( this.length < this.real_length ) {

			this.resize( this.length );

		}

	}

};


function convertGeometryToIndexedBuffer( geometry ) {

	var BGeom = new THREE.BufferGeometry();

	// create a new typed array
	var vertArray = new TypedArrayHelper( geometry.vertices.length, 0, THREE.Vector3, Float32Array, 3, [ 'x', 'y', 'z' ] );
	var indexArray = new TypedArrayHelper( geometry.faces.length, 0, THREE.Face3, Uint32Array, 3, [ 'a', 'b', 'c' ] );
	var uvArray = new TypedArrayHelper( geometry.faceVertexUvs[0].length * 3 * 3, 0, THREE.Vector2, Float32Array, 2, [ 'x', 'y' ] );

	for ( var i = 0, il = geometry.vertices.length; i < il; i++ ) {

		vertArray.push_element( geometry.vertices[ i ] );

	}

	for ( var i = 0, il = geometry.faces.length; i < il; i++ ) {

		indexArray.push_element( geometry.faces[ i ] );

	}

	for ( var i = 0, il = geometry.faceVertexUvs[ 0 ].length; i < il; i++ ) {

		uvArray.push_element( geometry.faceVertexUvs[ 0 ][ i ][ 0 ] );
		uvArray.push_element( geometry.faceVertexUvs[ 0 ][ i ][ 1 ] );
		uvArray.push_element( geometry.faceVertexUvs[ 0 ][ i ][ 2 ] );

	}

	indexArray.trim_size();
	vertArray.trim_size();
	uvArray.trim_size();

	BGeom.setIndex( new THREE.BufferAttribute( indexArray.buffer, 3 ) );
	BGeom.addAttribute( 'position', new THREE.BufferAttribute( vertArray.buffer, 3 ) );
	BGeom.addAttribute( 'uv', new THREE.BufferAttribute( uvArray.buffer, 2 ) );

	return BGeom;

}

function compute_vertex_normals( geometry ) {

	var ABC = [ 'a', 'b', 'c' ];
	var XYZ = [ 'x', 'y', 'z' ];
	var XY = [ 'x', 'y' ];

	var oldVertices = new TypedArrayHelper( 0, 5, THREE.Vector3, Float32Array, 3, XYZ );
	var oldFaces = new TypedArrayHelper( 0, 3, THREE.Face3, Uint32Array, 3, ABC );
	oldVertices.from_existing( geometry.getAttribute( 'position' ).array );
	var newNormals = new TypedArrayHelper( oldVertices.length * 3, 4, THREE.Vector3, Float32Array, 3, XYZ );
	var newNormalFaces = new TypedArrayHelper( oldVertices.length, 1, function () { this.x = 0; }, Float32Array, 1, [ 'x' ] );

	newNormals.length = oldVertices.length;
	oldFaces.from_existing( geometry.index.array );
	var a, b, c;
	var my_weight;
	var full_weights = [ 0.0, 0.0, 0.0 ];

	for ( var i = 0, il = oldFaces.length; i < il; i++ ) {

		oldFaces.index_to_register( i, 0 );

		oldVertices.index_to_register( oldFaces.register[ 0 ].a, 0 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].b, 1 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].c, 2 );

		newNormals.register[ 0 ].subVectors( oldVertices.register[ 1 ], oldVertices.register[ 0 ] );
		newNormals.register[ 1 ].subVectors( oldVertices.register[ 2 ], oldVertices.register[ 1 ] );
		newNormals.register[ 0 ].cross( newNormals.register[ 1 ] );
		my_weight = Math.abs( newNormals.register[ 0 ].length() );

		newNormalFaces.buffer[ oldFaces.register[ 0 ].a ] += my_weight;
		newNormalFaces.buffer[ oldFaces.register[ 0 ].b ] += my_weight;
		newNormalFaces.buffer[ oldFaces.register[ 0 ].c ] += my_weight;

	}

	var t_len;

	for ( var i = 0, il = oldFaces.length; i < il; i++ ) {

		oldFaces.index_to_register( i, 0 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].a, 0 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].b, 1 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].c, 2 );

		newNormals.register[ 0 ].subVectors( oldVertices.register[ 1 ], oldVertices.register[ 0 ] );
		newNormals.register[ 1 ].subVectors( oldVertices.register[ 2 ], oldVertices.register[ 0 ] );

		newNormals.register[ 3 ].set( 0, 0, 0 );
		newNormals.register[ 3 ].x = ( newNormals.register[ 0 ].y * newNormals.register[ 1 ].z ) - ( newNormals.register[ 0 ].z * newNormals.register[ 1 ].y );
		newNormals.register[ 3 ].y = ( newNormals.register[ 0 ].z * newNormals.register[ 1 ].x ) - ( newNormals.register[ 0 ].x * newNormals.register[ 1 ].z );
		newNormals.register[ 3 ].z = ( newNormals.register[ 0 ].x * newNormals.register[ 1 ].y ) - ( newNormals.register[ 0 ].y * newNormals.register[ 1 ].x );

		newNormals.register[ 0 ].cross( newNormals.register[ 1 ] );

		my_weight = Math.abs( newNormals.register[ 0 ].length() );

		full_weights[ 0 ] = ( my_weight / newNormalFaces.buffer[ oldFaces.register[ 0 ].a ] );
		full_weights[ 1 ] = ( my_weight / newNormalFaces.buffer[ oldFaces.register[ 0 ].b ] );
		full_weights[ 2 ] = ( my_weight / newNormalFaces.buffer[ oldFaces.register[ 0 ].c ] );

		newNormals.buffer[ ( oldFaces.register[ 0 ].a * 3 ) + 0 ] += newNormals.register[ 3 ].x * full_weights[ 0 ];
		newNormals.buffer[ ( oldFaces.register[ 0 ].a * 3 ) + 1 ] += newNormals.register[ 3 ].y * full_weights[ 0 ];
		newNormals.buffer[ ( oldFaces.register[ 0 ].a * 3 ) + 2 ] += newNormals.register[ 3 ].z * full_weights[ 0 ];

		newNormals.buffer[ ( oldFaces.register[ 0 ].b * 3 ) + 0 ] += newNormals.register[ 3 ].x * full_weights[ 1 ];
		newNormals.buffer[ ( oldFaces.register[ 0 ].b * 3 ) + 1 ] += newNormals.register[ 3 ].y * full_weights[ 1 ];
		newNormals.buffer[ ( oldFaces.register[ 0 ].b * 3 ) + 2 ] += newNormals.register[ 3 ].z * full_weights[ 1 ];

		newNormals.buffer[ ( oldFaces.register[ 0 ].c * 3 ) + 0 ] += newNormals.register[ 3 ].x * full_weights[ 2 ];
		newNormals.buffer[ ( oldFaces.register[ 0 ].c * 3 ) + 1 ] += newNormals.register[ 3 ].y * full_weights[ 2 ];
		newNormals.buffer[ ( oldFaces.register[ 0 ].c * 3 ) + 2 ] += newNormals.register[ 3 ].z * full_weights[ 2 ];

	}

	newNormals.trim_size();
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( newNormals.buffer, 3 ) );

}

function unIndexIndexedGeometry( geometry ) {

	var ABC = [ 'a', 'b', 'c' ];
	var XYZ = [ 'x', 'y', 'z' ];
	var XY = [ 'x', 'y' ];

	var oldVertices = new TypedArrayHelper( 0, 3, THREE.Vector3, Float32Array, 3, XYZ );
	var oldFaces = new TypedArrayHelper( 0, 3, THREE.Face3, Uint32Array, 3, ABC );
	var oldUvs = new TypedArrayHelper( 0, 3, THREE.Vector2, Float32Array, 2, XY );
	var oldNormals = new TypedArrayHelper( 0, 3, THREE.Vector3, Float32Array, 3, XYZ );

	oldVertices.from_existing( geometry.getAttribute( 'position' ).array );
	oldFaces.from_existing( geometry.index.array );
	oldUvs.from_existing( geometry.getAttribute( 'uv' ).array );

	compute_vertex_normals( geometry );
	oldNormals.from_existing( geometry.getAttribute( 'normal' ).array );

	var newVertices = new TypedArrayHelper( oldFaces.length * 3, 3, THREE.Vector3, Float32Array, 3, XYZ );
	var newNormals = new TypedArrayHelper( oldFaces.length * 3, 3, THREE.Vector3, Float32Array, 3, XYZ );
	var newUvs = new TypedArrayHelper( oldFaces.length * 3, 3, THREE.Vector2, Float32Array, 2, XY );
	var v, w;

	for ( var i = 0, il = oldFaces.length; i < il; i++ ) {

		oldFaces.index_to_register( i, 0 );

		oldVertices.index_to_register( oldFaces.register[ 0 ].a, 0 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].b, 1 );
		oldVertices.index_to_register( oldFaces.register[ 0 ].c, 2 );

		newVertices.push_element( oldVertices.register[ 0 ] );
		newVertices.push_element( oldVertices.register[ 1 ] );
		newVertices.push_element( oldVertices.register[ 2 ] );

			if ( oldUvs.length !== 0 ) {

				oldUvs.index_to_register( ( i * 3 ) + 0, 0 );
				oldUvs.index_to_register( ( i * 3 ) + 1, 1 );
				oldUvs.index_to_register( ( i * 3 ) + 2, 2 );

				newUvs.push_element( oldUvs.register[ 0 ] );
				newUvs.push_element( oldUvs.register[ 1 ] );
				newUvs.push_element( oldUvs.register[ 2 ] );

			}

		oldNormals.index_to_register( oldFaces.register[ 0 ].a, 0 );
		oldNormals.index_to_register( oldFaces.register[ 0 ].b, 1 );
		oldNormals.index_to_register( oldFaces.register[ 0 ].c, 2 );

		newNormals.push_element( oldNormals.register[ 0 ] );
		newNormals.push_element( oldNormals.register[ 1 ] );
		newNormals.push_element( oldNormals.register[ 2 ] );

	}

	newVertices.trim_size();
	newUvs.trim_size();
	newNormals.trim_size();

	geometry.index = null;

	geometry.addAttribute( 'position', new THREE.BufferAttribute( newVertices.buffer, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( newNormals.buffer, 3 ) );

	if ( newUvs.length !== 0 ) {

		geometry.addAttribute( 'uv', new THREE.BufferAttribute( newUvs.buffer, 2 ) );

	}

	return geometry;

}

THREE.BufferSubdivisionModifier = function( subdivisions ) {

	this.subdivisions = ( subdivisions === undefined ) ? 1 : subdivisions;

};

THREE.BufferSubdivisionModifier.prototype.modify = function( geometry ) {

	if ( geometry instanceof THREE.Geometry ) {

		geometry.mergeVertices();

		if ( typeof geometry.normals === 'undefined' ) {

			geometry.normals = [];

		}

		geometry = convertGeometryToIndexedBuffer( geometry );

	} else if ( !( geometry instanceof THREE.BufferGeometry ) ) {

		console.error( 'THREE.BufferSubdivisionModifier: Geometry is not an instance of THREE.BufferGeometry or THREE.Geometry' );

	}

	var repeats = this.subdivisions;

	while ( repeats -- > 0 ) {

		this.smooth( geometry );

	}

	return unIndexIndexedGeometry( geometry );

};

var edge_type = function ( a, b ) {

	this.a = a;
	this.b = b;
	this.faces = [];
	this.newEdge = null;

};

( function () {

	// Some constants
	var ABC = [ 'a', 'b', 'c' ];
	var XYZ = [ 'x', 'y', 'z' ];
	var XY = [ 'x', 'y' ];

	function getEdge( a, b, map ) {

		var key = Math.min( a, b ) + '_' + Math.max( a, b );
		return map[ key ];

	}


	function processEdge( a, b, vertices, map, face, metaVertices ) {

		var vertexIndexA = Math.min( a, b );
		var vertexIndexB = Math.max( a, b );

		var key = vertexIndexA + '_' + vertexIndexB;

		var edge;

		if ( key in map ) {

			edge = map[ key ];

		} else {

			edge = new edge_type( vertexIndexA,vertexIndexB );
			map[key] = edge;

		}

		edge.faces.push( face );

		metaVertices[ a ].edges.push( edge );
		metaVertices[ b ].edges.push( edge );

	}

	function generateLookups( vertices, faces, metaVertices, edges ) {

		var i, il, face, edge;

		for ( i = 0, il = vertices.length; i < il; i++ ) {

			metaVertices[ i ] = { edges: [] };

		}

		for ( i = 0, il = faces.length; i < il; i++ ) {

			faces.index_to_register( i, 0 );
			face = faces.register[ 0 ]; // Faces is now a TypedArrayHelper class, not a face3.

			processEdge( face.a, face.b, vertices, edges, i, metaVertices );
			processEdge( face.b, face.c, vertices, edges, i, metaVertices );
			processEdge( face.c, face.a, vertices, edges, i, metaVertices );

		}

	}

	function newFace( newFaces, face ) {

		newFaces.push_element( face );

	}

	function midpoint( a, b ) {

		return ( Math.abs( b - a ) / 2 ) + Math.min( a, b );

	}

	function newUv( newUvs, a, b, c ) {

		newUvs.push_element( a );
		newUvs.push_element( b );
		newUvs.push_element( c );

	}

	/////////////////////////////

	// Performs one iteration of Subdivision

	THREE.BufferSubdivisionModifier.prototype.smooth = function ( geometry ) {

		var oldVertices, oldFaces, oldUvs;
		var newVertices, newFaces, newUVs;

		var n, l, i, il, j, k;
		var metaVertices, sourceEdges;

		oldVertices = new TypedArrayHelper( 0, 3, THREE.Vector3, Float32Array, 3, XYZ );
		oldFaces = new TypedArrayHelper( 0, 3, THREE.Face3, Uint32Array, 3, ABC );
		oldUvs = new TypedArrayHelper( 0, 3, THREE.Vector2, Float32Array, 2, XY );
		oldVertices.from_existing( geometry.getAttribute( 'position' ).array );
		oldFaces.from_existing( geometry.index.array );
		oldUvs.from_existing( geometry.getAttribute( 'uv' ).array );

		var doUvs = false;

		if ( typeof oldUvs !== 'undefined' && oldUvs.length !== 0 ) {

			doUvs = true;

		}
		/******************************************************
		*
		* Step 0: Preprocess Geometry to Generate edges Lookup
		*
		*******************************************************/

		metaVertices = new Array( oldVertices.length );
		sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

		generateLookups( oldVertices, oldFaces, metaVertices, sourceEdges );


		/******************************************************
		*
		*	Step 1.
		*	For each edge, create a new Edge Vertex,
		*	then position it.
		*
		*******************************************************/

		newVertices = new TypedArrayHelper( ( geometry.getAttribute( 'position' ).array.length * 2 ) / 3, 2, THREE.Vector3, Float32Array, 3, XYZ );
		var other, currentEdge, newEdge, face;
		var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

		var tmp = newVertices.register[ 1 ];
		for ( i in sourceEdges ) {

		currentEdge = sourceEdges[ i ];
		newEdge = newVertices.register[ 0 ];

		edgeVertexWeight = 3 / 8;
		adjacentVertexWeight = 1 / 8;

		connectedFaces = currentEdge.faces.length;

		// check how many linked faces. 2 should be correct.
		if ( connectedFaces !== 2 ) {

			// if length is not 2, handle condition
			edgeVertexWeight = 0.5;
			adjacentVertexWeight = 0;

		}

		oldVertices.index_to_register( currentEdge.a, 0 );
		oldVertices.index_to_register( currentEdge.b, 1 );
		newEdge.addVectors( oldVertices.register[ 0 ], oldVertices.register[ 1 ] ).multiplyScalar( edgeVertexWeight );

		tmp.set( 0, 0, 0 );

		for ( j = 0; j < connectedFaces; j++ ) {

			oldFaces.index_to_register( currentEdge.faces[ j ], 0 );
			face = oldFaces.register[ 0 ];

			for ( k = 0; k < 3; k++ ) {

				oldVertices.index_to_register( face[ ABC[ k ] ], 2 );
				other = oldVertices.register[ 2 ];

				if ( face[ ABC[ k ] ] !== currentEdge.a && face[ ABC[ k ] ] !== currentEdge.b) {

					break;

				}

		}

		tmp.add( other );

		}

		tmp.multiplyScalar( adjacentVertexWeight );
		newEdge.add( tmp );

		currentEdge.newEdge = newVertices.length;
		newVertices.push_element( newEdge );

		}

		var edgeLength = newVertices.length;
		/******************************************************
		*
		*	Step 2.
		*	Reposition each source vertices.
		*
		*******************************************************/

		var beta, sourceVertexWeight, connectingVertexWeight;
		var connectingEdge, connectingEdges, oldVertex, newSourceVertex;

		for ( i = 0, il = oldVertices.length; i < il; i++ ) {

			oldVertices.index_to_register( i, 0, XYZ );
			oldVertex = oldVertices.register[ 0 ];

			// find all connecting edges (using lookupTable)
			connectingEdges = metaVertices[ i ].edges;
			n = connectingEdges.length;

			if ( n === 3 ) {

				beta = 3 / 16;

			} else if (n > 3) {

				beta = 3 / (8 * n); // Warren's modified formula

			}

			// Loop's original beta formula
			// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

			sourceVertexWeight = 1 - n * beta;
			connectingVertexWeight = beta;

			if ( n <= 2 ) {

				// crease and boundary rules

				if ( n === 2 ) {

					sourceVertexWeight = 3 / 4;
					connectingVertexWeight = 1 / 8;

				}

			}

			newSourceVertex = oldVertex.multiplyScalar( sourceVertexWeight );

			tmp.set( 0, 0, 0 );

			for ( j = 0; j < n; j++ ) {

				connectingEdge = connectingEdges[ j ];
				other = connectingEdge.a !== i ? connectingEdge.a : connectingEdge.b;
				oldVertices.index_to_register( other, 1, XYZ );
				tmp.add( oldVertices.register[ 1 ] );

			}

			tmp.multiplyScalar( connectingVertexWeight );
			newSourceVertex.add( tmp );

			newVertices.push_element( newSourceVertex,XYZ );

		}


		/******************************************************
		*
		*	Step 3.
		*	Generate faces between source vertices and edge vertices.
		*
		*******************************************************/


		var edge1, edge2, edge3;
		newFaces = new TypedArrayHelper( ( geometry.index.array.length * 4 ) / 3, 1, THREE.Face3, Float32Array, 3, ABC );
		newUVs = new TypedArrayHelper( ( geometry.getAttribute( 'uv' ).array.length * 4 ) / 2, 3, THREE.Vector2, Float32Array, 2, XY );
		var x3 = newUVs.register[ 0 ];
		var x4 = newUVs.register[ 1 ];
		var x5 = newUVs.register[ 2 ];
		var tFace = newFaces.register[ 0 ];

		for ( i = 0, il = oldFaces.length; i < il; i++ ) {

			oldFaces.index_to_register( i, 0 );
			face = oldFaces.register[ 0 ];

			// find the 3 new edges vertex of each old face
			// The new source verts are added after the new edge verts now..

			edge1 = getEdge( face.a, face.b, sourceEdges ).newEdge;
			edge2 = getEdge( face.b, face.c, sourceEdges ).newEdge;
			edge3 = getEdge( face.c, face.a, sourceEdges ).newEdge;

			// create 4 faces.
			tFace.set( edge1, edge2, edge3 );
			newFace( newFaces, tFace );
			tFace.set( face.a + edgeLength, edge1, edge3 );
			newFace( newFaces, tFace );
			tFace.set( face.b + edgeLength, edge2, edge1 );
			newFace( newFaces, tFace );
			tFace.set( face.c + edgeLength, edge3, edge2 );
			newFace( newFaces, tFace );


			/*
				0________C_______2
				 \      /\      /
				  \ F2 /  \ F4 /
				   \  / F1 \  /
				    \/______\/
				   A \      / B
				      \ F3 /
				       \  /
				        \/
				         1
				Draw orders:
				F1: ABC x3,x4,x5
				F2: 0AC x0,x3,x5
				F3: 1BA x1,x4,x3
				F4: 2CB x2,x5,x4
				0: x0
				1: x1
				2: x2
				A: x3
				B: x4
				C: x5
			*/

			if ( doUvs === true ) {

				oldUvs.index_to_register( ( i * 3 ) + 0, 0 );
				oldUvs.index_to_register( ( i * 3 ) + 1, 1 );
				oldUvs.index_to_register( ( i * 3 ) + 2, 2 );

				var x0 = oldUvs.register[ 0 ]; // uv[0];
				var x1 = oldUvs.register[ 1 ]; // uv[1];
				var x2 = oldUvs.register[ 2 ]; // uv[2];

				x3.set( midpoint( x0.x, x1.x ), midpoint( x0.y, x1.y ) );
				x4.set( midpoint( x1.x, x2.x ), midpoint( x1.y, x2.y ) );
				x5.set( midpoint( x0.x, x2.x ), midpoint( x0.y, x2.y ) );

				newUv( newUVs, x3, x4, x5 );
				newUv( newUVs, x0, x3, x5 );

				newUv( newUVs, x1, x4, x3 );
				newUv( newUVs, x2, x5, x4 );

			}

		}

		// Overwrite old arrays

		newFaces.trim_size();
		newVertices.trim_size();
		newUVs.trim_size();

		geometry.setIndex( new THREE.BufferAttribute( newFaces.buffer ,3 ) );
		geometry.addAttribute( 'position', new THREE.BufferAttribute( newVertices.buffer, 3 ) );
		geometry.addAttribute( 'uv', new THREE.BufferAttribute( newUVs.buffer, 2 ) );

	};

} ) ();

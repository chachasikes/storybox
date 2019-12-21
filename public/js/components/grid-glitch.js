AFRAME.registerShader("grid-glitch", {
  schema: {
    color: { type: "color", is: "uniform" },
    c: { type: "float", is: "uniform", value: 0.5 },
    p: { type: "float", is: "uniform", value: 3.4 },
    viewVector: { type: "vec3", is: "uniform", value: {x: 100, y: 100, z:100} },
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
    uniform vec3 color;
    varying float intensity;
    void main() {
      vec3 glow = color * intensity;
      gl_FragColor = vec4( glow, 1.0 );

      // float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );
	    // gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
    }
  `
});

import { formatDropboxRawLinks  } from './utilities/dropbox-format.js';
import { buildHandPropInterface } from './components/accordion-stretch.js';

/**
 * Build AFrame markup from JSON settings.
 * @module StoryboxAframe
 */
export class StoryboxAframe {
  constructor() {
    this.getAxisCoordinates = this.getAxisCoordinates.bind(this);
    this.getValue = this.getValue.bind(this);
    // Set default player height, arms
    this.playerHeight = 1.6;
    this.playerArmOffset = -0.5;
    // Collector for materials.
    this.materials = {};
  }

  /**
   * Look for any urls hosted on Dropbox and convert to the immediately downloadable link.
   * The Dropbox share link outputs a www.dropbox.com/path/filename?dl=0 and this is an HTML page
   * https://dl.dropboxusercontent.com is the correct path
   * and the ?dl=0 needs to be removed
   * This allows for simple hosting for low traffic assets.
   * Higher traffic assets would need to be hosted on a server most likely as there may be some limits on Dropbox.
   * Some of the assets are too large for github or glitch repos.
   * This also helps letting artists collaborate and replace files easily.
   *
   * @param {object} data - The values for the item
   * @param {object} data - Return formatted data
   */
  formatDropboxDataRecursive(data)  {
    let propKeys = Object.keys(data);
    for (let i=0; i < propKeys.length; i++) {
      let propKey = propKeys[i];
      switch(propKey) {
        // All tags that need conversion
        // @TODO there may be some tags not converted. Check.
        case 'art':
        case 'src':
        case 'panel':
        case 'material':
        case 'glb':
        case 'texture':
          if (typeof data[propKey].replace === 'function') {
            data[propKey] = data[propKey].replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');
          }
          // For cubemaps
          if (typeof data[propKey] === 'object' &&
            (data[propKey].top !== undefined ||
             data[propKey].bottom !== undefined ||
             data[propKey].left !== undefined ||
             data[propKey].right !== undefined ||
             data[propKey].front !== undefined ||
             data[propKey].back !== undefined
          )) {
            let faceKeys = Object.keys(data[propKey]);
            for (let j=0; j < faceKeys.length; j++) {
              let face = faceKeys[j];
              if (data[propKey][face] !== undefined && typeof data[propKey][face].replace === 'function') {
                data[propKey][face] = formatDropboxRawLinks(data[propKey][face]);
              }
            };
          }
        break;
      }
    }
    return data;
  }

  /**
   * Create tags and attributes from JSON settings for AFrame markup.
   *
   * @param {string} name - The attribute name to look up in data
   * @param {object} data - The values for the item
   * @returns {object} - Object with tag and attribute
   */
  getValue(name, data) {
    if (data !== undefined && data[name] !== undefined) {
      return {
        tag: `${name}="${data[name]}"`,
        attribute: `${data[name]}`
      };
    }
    return {
      tag: ``,
      attribute: ``
    };
  }

  /**
   * Create property tags from JSON settings for AFrame markup.
   *
   * @param {string} name - the attribute name to look up in data
   * @param {object} data - The properties for this element.
   * @returns {string} - Property string for HTML
   */
  getProperty(name, data) {
    if (data !== undefined && data[name] !== undefined) {
      let props = data[name];
      let options = ``;
      Object.keys(props).map(prop => {
        options = `${options}${prop}=${props[prop]};`;
      });
      return `${name}=${options}`;
    }
    return ``;
  }

  /**
   * Return tags for x y z coordinates.
   *
   * @param {string} name - the attribute name to look up in data
   * @param {object} data - The properties for this element.
   * @param {number} data.x - X coordinate
   * @param {number} data.y - Y coordinate
   * @param {number} data.z - Z coordinate
   * @returns {object} - Object with tag and attribute
   */
  getAxisCoordinates(name, data) {
    if (
      data !== undefined &&
      data[name] !== undefined &&
      data[name].x !== undefined &&
      data[name].y !== undefined &&
      data[name].z !== undefined
    ) {
      return {
        tag: `${name}="${data[name].x} ${data[name].y} ${data[name].z}"`,
        attributes: `${data[name].x} ${data[name].y} ${data[name].z}`
      };
    }
    return {
      tag: ``,
      attributes: ``
    };
  }

  /**
   * Return tags for w h l dimensions.
   *
   * @param {string} name - the attribute name to look up in data
   * @param {object} data - The properties for this element.
   * @param {number} data.width - Width coordinate
   * @param {number} data.height - Height coordinate
   * @param {number} data.depth - Depth coordinate
   * @returns {string} - Property string for HTML
   */
  getDimensions(name, data) {
    if (
      data !== undefined &&
      data[name] !== undefined &&
      data[name].width !== undefined &&
      data[name].height !== undefined &&
      data[name].depth !== undefined
    ) {
      return {
        tag: `width="${data[name].width}" height="${
          data[name].height
        }" depth="${data[name].depth}"`,
        attributes: `${data[name].width} ${data[name].height} ${
          data[name].depth
        }`
      };
    }
    return ``;
  }

  /**
   * Create all tags possible for an object, since AFrame settings can have similar optional properties.
   *
   * @param {object} props - The properties for this element.
   * @param {number} props.dimensions - Dimensions
   * @param {number} props.dimensions.width - Width coordinate
   * @param {number} props.dimensions.height - Height coordinate
   * @param {number} props.dimensions.depth - Depth coordinate
   * @param {object} props.position - Position object
   * @param {number} props.position.x - X coordinate
   * @param {number} props.position.y - Y coordinate
   * @param {number} props.position.z - Z coordinate
   * @param {object} props.rotation - Rotation object
   * @param {number} props.rotation.x - X coordinate
   * @param {number} props.rotation.y - Y coordinate
   * @param {number} props.rotation.z - Z coordinate
   * @param {number} props.scale - Scale coordinate
   * @param {float} props.offset - UV offset (@TODO confirm)
   * @param {string} props.text - Text
   * @param {string} props.color - Color (Hex)
   * @param {string} props.className - class name to insert for interactivity
   * @param {line} props.line - Line
   * @returns {string} - Property string for HTML
   */
  buildTags(props) {
    let scale = this.getAxisCoordinates("scale", props);
    let rotation = this.getAxisCoordinates("rotation", props);
    let position = this.getAxisCoordinates("position", props);
    let offset = this.getAxisCoordinates("offset", props);
    let color = this.getValue("color", props);
    let text = this.getValue("text", props);
    let dimensions = this.getDimensions("dimensions", props);
    let classProps = this.getValue("className", props);
    let className = `class="${classProps.attribute}"`;
    let line = this.getProperty("line", props);

    return {
      scale,
      rotation,
      position,
      offset,
      color,
      text,
      dimensions,
      classProps,
      className,
      line
    }
  }

  /**
   * Compose a cube map with individual images.
   * Key: imagecube
   *
   * @param {object} data - The properties for this element.
   * @param {object} data.art - Urls to image files.
   * @param {object} data.art.back - Back image
   * @param {object} data.art.front - Front image
   * @param {object} data.art.bottom - Bottom image
   * @param {object} data.art.top - Top image
   * @param {object} data.art.left - Left image
   * @param {object} data.art.right - Right image
   * @param {object} data.position - Position object
   * @param {number} data.position.x - X coordinate
   * @param {number} data.position.y - Y coordinate
   * @param {number} data.position.z - Z coordinate
   * @param {object} data.rotation - Rotation object
   * @param {number} data.rotation.x - X coordinate
   * @param {number} data.rotation.y - Y coordinate
   * @param {number} data.rotation.z - Z coordinate
   * @param {number} data.scale - Scale coordinate

   * @returns {object} - Cube object with formatted markup.
   */
  buildCubemap(data) {
    // @TODO see also cube-map-env aframe extras
    // <a-box cube-map-env src="https://dl.dropboxusercontent.com/s/q5sndy1rk2drufh/hand-drawn--bake1.jpg" position="2 0.5 -4"></a-box>
    let cube = [
      {
        position: `position="${data.position.x} ${data.position.y} ${data.position.z - data.scale.z / 2}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.back : data.art
      },
      {
        position: `position="${data.position.x} ${data.position.y} ${data.position.z + data.scale.z / 2}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.front : data.art
      },
      {
        position: `position="${data.position.x} ${data.position.y - data.scale.y / 2} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x - 90} ${data.rotation.y} ${ data.rotation.z }"`,
        art: typeof data.art === "object" ? data.art.bottom : data.art
      },
      {
        position: `position="${data.position.x} ${data.position.y + data.scale.y / 2} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x + 90} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.top : data.art
      },
      {
        position: `position="${data.position.x - data.scale.x / 2} ${data.position.y} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y - 90} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.left : data.art
      },
      {
        position: `position="${data.position.x + data.scale.x / 2} ${data.position.y} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y + 90} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.right : data.art
      }
    ];
    return cube;
  }

  /**
   * Build skybox with equirectangular image.
   * Key: sky
   * @constructor
   * @param {object} props - The JSON Settings.
   * @param {string} props.color - Color of sky
   * @param {string} props.art - Url to equirectangular image
   * @param {string} props.id - Element ID
   * @param {string} innerMarkup - The current AFrame markup insert
   * @param {array} childElements - The items to insert into <a-assets> tag for preloading.
   * @param {array} preloadElements - The current AFrame markup insert
   * @param {object} aframeTags - Composed attribute tags to insert as AFrame options
   * @returns {object} - Preloaded elements, Aframe markup and Child elements.
   */
  buildSkybox(props, innerMarkup, childElements, preloadElements, aframeTags) {
    if (props.color !== undefined) {
      innerMarkup = `${innerMarkup}<a-sky color="${
        aframeTags.color.attribute
      }"></a-sky>`;
    } else if (
      props.color === undefined &&
      props.art !== undefined &&
      props.id !== undefined
    ) {
      childElements.push(
        `<img ${aframeTags.className} id="${props.id}" src="${
          props.art
        }" crossorigin="anonymous" preload="true" />`
      );

      // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
      innerMarkup = `${innerMarkup}
        <a-sky render-order="sky" ${aframeTags.className} src="#${props.id}" ${
        aframeTags.color.attribute
      } animation="property: rotation; to: ${
        aframeTags.rotation.attributes
      }; dur: 10" preload="auto"
        animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
        animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade">
        </a-sky>`;
    }

    return {
      childElements,
      innerMarkup,
      preloadElements
    }
  }

  buildTextures(props) {
    let textures = `roughness: 1; metalness: 0;`;
    if (props.src !== undefined) {
      textures += `src: ${formatDropboxRawLinks(props.src)}; `;
    }
    if (props.normalMap !== undefined) {
      // @TODO Figure this out, seems unsupported? normalScale: ${props.normalScale ? new THREE.Vector2( props.normalScale[0], props.normalScale[1] ) : new THREE.Vector2(1,1)};
      textures += `normalMap: ${formatDropboxRawLinks(props.normalMap)}; `;
    }

    if (props.ambientOcclusionMap !== undefined) {
      textures += `ambientOcclusionMap: ${formatDropboxRawLinks(props.ambientOcclusionMap)}; `;
    }

    if (props.displacementMap !== undefined) {
      textures += `displacementMap: ${formatDropboxRawLinks(props.displacementMap)}; displacementScale: ${props.displacementScale ? props.displacementScale : 1.0};  displacementBias: ${props.displacementBias ? props.displacementBias : 1.0};`;
    }
    // "displacementMap": "https://www.dropbox.com/s/kpuus85pt8gytop/Paper_Recycled_001_DISP.png?dl=0",
    // "displacementScale": 3.0,
    // "displacementBias": 0,

    if (props.roughnessMap !== undefined) {
      textures += `roughnessMap: ${formatDropboxRawLinks(props.roughnessMap)}; roughness: ${props.roughness ? props.roughness : 0.5};`;
    }

    if (props.bumpMap !== undefined) {
      textures += `bumpMap: ${formatDropboxRawLinks(props.bumpMap)}; bumpScale: ${props.bumpScale ? props.bumpScale : 1.0}; `;
    }

    if (props.environmentMap !== undefined) {
      textures += `environmentMap: ${formatDropboxRawLinks(props.environmentMap)}; envMapIntensity: ${props.envMapIntensity ? props.envMapIntensity : 1.0}; refractionRatio: ${props.refractionRatio ? props.refractionRatio : 0.98}`;
    }

    if (props.emissiveMap !== undefined) {
      textures += `emissiveMap: ${formatDropboxRawLinks(props.emissiveMap)}; `;
    }

    if (props.lightMap !== undefined) {
      textures += `lightMap: ${formatDropboxRawLinks(props.lightMap)}; lightMapIntensity: ${props.lightMapIntensity ? props.lightMapIntensity : 1.0}  `;
    }

    if (props.alphaMap !== undefined) {
      textures += `alphaMap: ${formatDropboxRawLinks(props.alphaMap)}; transparent: true; alphaTest: ${props.alphaTest ? props.alphaTest : 0.5}; colorWrite: false; `;
    }

    if (props.repeatScale !== undefined && props.repeatScale.u !== undefined && props.repeatScale.v !== undefined) {
      textures += `repeatScaleU: ${props.repeatScale.u}; repeatScaleV: ${props.repeatScale.v}; `;
    }

    if (props.color !== undefined) {
      textures += `color: ${props.color}; `;
    }

    // textures = `src: formatDropboxRawLinks(props.normalPath); color: #696969; roughness: 1; metalness: 0`;
    return textures;
    // path: {default: ''},
    // normalPath: {default: null},
    // bumpPath: {default: null},
    // alphaPath: {default: null},
    // displacementPath: {default: null},
    // roughnessPath: {default: null},
    // environmentPath: {default: null},
    // emissivePath: {default: null},
    // lightMapPath: {default: null},
    // ambientOcculsionPath: {default: null},
    // opacity: {default: null},
    // extension: {default: 'jpg'},
    // format: {default: 'RGBFormat'},
    // enableBackground: {default: false}
  }

  /**
   * Given JSON settings, output a mesh object.
   * Key: mesh
   * JSON Parameters
   * @constructor
   * @param {object} props - The JSON Settings.
   * @param {string} props.art - The JSON Settings. Can be .obj or .glb (GLTF 1.0 or 2.0, GLB is the single file binary format)
   * @param {string} props.classname - Classname to add for interactivity
   * @param {string} props.texture -
   * @param {string} props.id -
   * @param {string} props.material - Required if filetype is OBJ. Link to .mtl file.
   * @param {float} props.opacity -
   * @param {object} props.position - Position object
   * @param {number} props.position.x - X coordinate
   * @param {number} props.position.y - Y coordinate
   * @param {number} props.position.z - Z coordinate
   * @param {object} props.rotation - Rotation object
   * @param {number} props.rotation.x - X coordinate
   * @param {number} props.rotation.y - Y coordinate
   * @param {number} props.rotation.z - Z coordinate
   * @param {number} props.scale - Scale coordinate
   * @param {boolean} props.glb_legacy - If GLB files is GLTF Version 1.0
   * @param {string} innerMarkup - The current AFrame markup insert
   * @param {array} childElements - The current AFrame markup insert
   * @param {array} preloadElements - The current AFrame markup insert
   * @param {object} aframeTags - Composed attribute tags to insert as AFrame options
   * @returns {object} - Preloaded elements, Aframe markup and Child elements.
   */
  buildMesh(props, innerMarkup, childElements, preloadElements, aframeTags, soundMarkup) {
    props = this.formatDropboxDataRecursive(props);
    let classProps = this.getValue("className", props);
    let className = `class="${classProps.attribute}"`;
    // Set up textures.
    let textures = ``;
    if (props.texture !== undefined) {
      textures = this.buildTextures(props.texture);
    }

    let tag = ``;

    // Create animation behvior.
    let animation = ``;
    if (props.events !== undefined && props.events.length > 0) {
      // https://aframe.io/docs/0.9.0/components/animation.html
      window.StoryboxNavigator.sceneEvents.push(props.events);
      props.events.map((item) => {
        if (item.type === 'intersection-play') {
          // @TODO can add more behaviors here if needed (like rotating, moving, pulsing etc.)
          animation = `
            animation="
              startEvents: ${item.id}-${item.eventName};
              property: ${item.attribute ? item.attribute : 'gltf-model-opacity'};
              from: ${item.from ? item.from : 0};
              to: ${item.to ? item.to : 1};
              dur: ${item.duration ? Number(item.duration) : 1000};
              easing: ${item.easing ? item.easing : 'linear'};
              autoplay: ${item.autoplay ? item.autoplay : false};
              enabled: ${item.enabled ? item.enabled : true};
              elasticity: ${item.elasticity ? item.elasticity : 400};
              loop: ${item.loop ? item.loop : false};
              delay: ${item.delay ? item.delay : false};
              dir: ${item.dir ? item.dir : 'normal'};
              round: ${item.round ? item.round : false};
              " `;
        }
      });
    }

    // Depending on the kind of source file (or aframe shapes), build mesh object.
    if (props.art !== undefined) {
      let fileType = props.art.split('.').pop();
      className = `class="${classProps.attribute} glb-animation"`;

      preloadElements.push(
        `<a-asset-item ${aframeTags.className} id="${props.id}" src="${props.art}" preload="auto" loaded></a-asset-item>`
      );

      if (props.sound !== undefined && props.sound.id !== undefined && props.sound.src !== undefined) {
        preloadElements.push(
          `<audio id="${props.sound.id}" src="${props.sound.src}" preload="auto"></audio>
          `
        );
      }

      if (fileType === 'glb') {
        let texture = props.texture !== undefined? `model-material="${textures}"` : ``;
        let opacity = props.opacity !== undefined ? `gltf-model-opacity="${props.opacity}"` : ``;
        let glb_legacy = props.glb_legacy !== undefined ? props.glb_legacy : false;

        className = `class="glb-animation ${classProps.attribute} ${props.texture !== undefined ? 'textured' : ''}"`;

        // https://aframe.io/docs/0.9.0/components/gltf-model.html

        // Support GLTF 1.0 and 2.0. Tiltbrush exports glb1, which need to be renamed as glb
        let gltf_model = glb_legacy ? 'gltf-model-legacy' : 'gltf-model';

        let animationMixer = ` animation-mixer-storybox `;
        if (props.animationMixer !== undefined) {
          if (props.animationMixer.type === 'stretch') {
            animationMixer = `data-animation-type="stretch" animation-mixer-storybox="
              clip: ${props.animationMixer.stretch};
              ${props.animationMixer.duration ? 'duration: ' + props.animationMixer.duration : ''};
              crossFadeDuration: ${props.animationMixer.crossFadeDuration ? props.animationMixer.crossFadeDuration : 0};
              loop: ${props.animationMixer.loop ? props.animationMixer.loop : 'once'};
              repetitions: ${props.animationMixer.repetitions ? props.animationMixer.repetitions : "Infinity"};
              timeScale: ${props.animationMixer.timeScale ? props.animationMixer.timeScale : 1};
            " `;
          }
        }

        tag = `<a-entity
        id="${props.id}-gltf"
        ref="${props.id}"
        ${className}
        ${gltf_model}="#${props.id}"
        ${opacity}
        ${texture}
        ${aframeTags.scale.tag}
        ${aframeTags.position.tag}
        ${aframeTags.rotation.tag}
        ${soundMarkup}
        crossorigin="anonymous"
        preload="true"
        ${animationMixer}
        ${props.component !== undefined ? props.component : ``}
        ${animation}
        ${props.autoPlay !== undefined && props.autoplay === true ? `data-autoplay="true"` : `data-autoplay="false"`}
        >
        </a-entity>`;

        // console.log(tag);

        innerMarkup = `${innerMarkup}
          ${tag}
          `;
      } else if (fileType === 'obj') {
        let texture = props.texture !== undefined ? `model-material="${textures}"` : ``;
        let opacity = props.opacity !== undefined ? `obj-model-opacity="${props.opacity}"` : ``;

        let material = ``;
        let materialProp = ``;
        tag = `<a-obj-model
        src="#${props.id}"
        ref="${props.id}"
        ${texture}
        ${className}
        ${opacity}
        ${aframeTags.scale.tag}
        ${aframeTags.position.tag}
        ${aframeTags.rotation.tag}
        ${soundMarkup}
        crossorigin="anonymous"
        preload="true"
        ${props.component !== undefined ? props.component : ``}
        ${animation}
        >
        </a-obj-model>`;
        innerMarkup = `${innerMarkup}
          ${tag}`;
      }
    } else if (props.geometry === "plane") {
      tag = `<a-entity
      geometry="primitive: plane; height: ${props.dimensions.height}; width: ${props.dimensions.width};"
      material="color: ${props.color}; shader: flat;"
      ref="${props.id}"
      ${className}
      ${aframeTags.scale.tag}
      ${aframeTags.position.tag}
      ${aframeTags.rotation.tag}
      ${props.component !== undefined ? props.component : ``}
      ${soundMarkup}
      ${animation}
      >
      </a-entity>`;

      innerMarkup = `${innerMarkup}
        ${tag}`;
    } else if (props.geometry === "sphere") {
      tag = `<a-entity
      geometry="primitive: sphere; radius: ${props.dimensions.radius}"
      material="color: ${props.color}; shader: flat;"
      ref="${props.id}"
      ${aframeTags.position.tag}
      ${aframeTags.rotation.tag}
      ${props.component !== undefined ? props.component : ``}
      ${soundMarkup}
      ${animation}
      >
      </a-entity>`;
      innerMarkup = `${innerMarkup}
        ${tag}`;
    }

    return {
      childElements,
      innerMarkup,
      preloadElements,
      tag
    }
  }

  buildSound(props, innerMarkup, childElements, preloadElements, aframeTags) {
    let tag = ``;
    props = this.formatDropboxDataRecursive(props);
    let classProps = this.getValue("className", props);
    let className = `class="${classProps.attribute}"`;
    if (props.src !== undefined) {
      let fileType = props.src.split('.').pop();

      preloadElements.push(
        `<audio id="${props.id}" src="${props.src}"></audio>`
      );

      // @TODO see if firefox will actually play mp3 files
      // Requires browser permissions.

      let soundAttributes = Object.assign({}, props);
      let soundTag = ``;
      soundAttributes.src = `#${props.id}`;
      delete soundAttributes.id;
      delete soundAttributes.description;
      delete soundAttributes.name;
      delete soundAttributes.credit;
      Object.keys(soundAttributes).map(tag => {
        soundTag = `${soundTag}${tag}: ${soundAttributes[tag]};`
      });

      tag = ` sound="${soundTag}" `;
    } else if (props.type !== undefined && props.type === 'midi-player') {
      tag = ` midi-player="soundfont: ${props.soundfont}; song: ${props.song};" `
    }

    return tag;
  }


  /**
   * Placeholder function for jumping between viewpoints
   * Key: sky
   * @constructor
   * @param {object} props - The JSON Settings.
   * @param {string} innerMarkup - The current AFrame markup insert
   * @param {array} childElements - The items to insert into <a-assets> tag for preloading.
   * @param {array} preloadElements - The current AFrame markup insert
   * @param {object} aframeTags - Composed attribute tags to insert as AFrame options
   * @returns {object} - Preloaded elements, Aframe markup and Child elements.
   */
  buildStoryboxes(props, innerMarkup, childElements, preloadElements, aframeTags) {
    return {
      childElements,
      innerMarkup,
      preloadElements
    }
  }

  /**
   * Build a sphere for testing intersections with the head.
   * @constructor
   * @param {object} props - The JSON Settings.
   * @returns {object} - Object with head markup.
   */
  buildHead(props) {
    return {
      head: `
      <a-sphere render-order="head" intersection-play="" class="head" id="head" radius="0.2">
      </a-sphere>
      `
    }
  }

  /**
   * Build a VR compatible camera.
   * Attach:
   * Gaze cursor
   * Hand props touch controllers
   * Intersectable Head
   * @param {object} props - The JSON Settings.
   * @param {string} props.classname - Classname to add for interactivity
   * @param {string} props.id - ID
   * @param {string} props.name - Name
   * @param {object} props.position - Position object
   * @param {number} props.position.x - X coordinate
   * @param {number} props.position.y - Y coordinate
   * @param {number} props.position.z - Z coordinate
   * @param {object} props.rotation - Rotation object
   * @param {number} props.rotation.x - X coordinate
   * @param {number} props.rotation.y - Y coordinate
   * @param {number} props.rotation.z - Z coordinate
   * @param {number} props.scale - Scale coordinate
   * @param {boolean} props.cursorCamera - Include gaze cursor ring.
   * @param {boolean} props.cursorTargetClass - Target class for cursor
   * @param {string} innerMarkup - The current AFrame markup insert
   * @param {array} childElements - The items to insert into <a-assets> tag for preloading.
   * @param {array} preloadElements - The current AFrame markup insert
   * @param {object} aframeTags - Composed attribute tags to insert as AFrame options
   * @param {string} handProp.left - Connect a mesh to left hand
   * @param {string} handProp.right - Connect a mesh to right hand
   * @param {float} this.playerHeight - Current player height
   * @returns {object} - Preloaded elements, Aframe markup and Child elements.
   */
  buildCamera(props, innerMarkup, childElements, preloadElements, aframeTags, handProp) {
    let cursor = this.buildCursor(props);
    let touchContollers = this.buildTouchControllers(props, handProp, preloadElements, aframeTags, innerMarkup, childElements);
    let headBox = this.buildHead(props);
    innerMarkup = `${innerMarkup}
    <a-entity
      id="rig"
      ${aframeTags.position.tag}
      ${aframeTags.rotation.tag}
      ${aframeTags.scale.tag}
    >
      <a-camera
        ${aframeTags.className}
        id="${props.id}"
        ${cursor.cursorCameraControls}
        position="0 ${this.playerHeight} 0"
      >
        ${cursor.cursor}
        ${headBox.head}
      </a-camera>
      ${touchContollers.touchContollers}
    </a-entity>
    `;
    return {
      preloadElements: preloadElements,
      childElements: childElements,
      innerMarkup: innerMarkup,
    }
  }

  /**
   * Set up hand controls
   * @TODO Document
   * @constructor
   */


  buildTouchControllers(props, handProp, preloadElements, aframeTags, innerMarkup, childElements) {
    let leftModel = ``;
    let rightModel = ``;
    let orientationOffsetLeft = ``;
    let orientationOffsetRight = ``;
    let modelLoaded = "model: false";
    let debuggerPanelWrist = {debuggerPanelWrist: ``};
    let laser = this.buildLaser(props);
    debuggerPanelWrist = this.buildWristDebugger();
    if (props.touch !== undefined) {
      // https://aframe.io/docs/0.9.0/introduction/interactions-and-controllers.html
      // Can change hand controller
      if (props.touch.left.glb !== undefined) {
        props.touch.left = this.formatDropboxDataRecursive(props.touch.left);
        let leftModelScale = this.getAxisCoordinates(
          "scale",
          props.touch.left
        );
        let leftModelPosition = this.getAxisCoordinates(
          "position",
          props.touch.left
        );
        let leftModelRotation = this.getAxisCoordinates(
          "rotation",
          props.touch.left
        );

        if (props.touch.left.orientationOffset !== undefined) {
          orientationOffsetLeft = `offsetOrientation="${props.touch.left.orientationOffset}"`;
        }
        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        preloadElements.push(
          `<a-asset-item id="${props.touch.left.id}" src="${props.touch.left.glb}"></a-asset-item>`
        );

        leftModel = `
        <a-entity
        ${aframeTags.className}
        gltf-model="#${props.touch.left.id}"
        ${leftModelScale.tag}
        ${leftModelPosition.tag}
        ${leftModelRotation.tag}
        crossorigin="anonymous"
        preload="true"
        >
        </a-entity>`;
        modelLoaded = "model: false";
      }

      if (
        props.touch.right !== undefined &&
        props.touch.right.glb !== undefined
      ) {
        props.touch.right = this.formatDropboxDataRecursive(props.touch.right);
        let rightModelScale = this.getAxisCoordinates(
          "scale",
          props.touch.right
        );
        let rightModelPosition = this.getAxisCoordinates(
          "position",
          props.touch.right
        );

        if (props.touch.right.orientationOffset !== undefined) {
          orientationOffsetRight = `offsetOrientation="${props.touch.right.orientationOffset}"`;
        }
        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        preloadElements.push(
          `<a-asset-item id="${props.touch.right.id}" src="${props.touch.right.glb}"></a-asset-item>`
        );

        rightModel = `
        <a-entity
        ${aframeTags.className}
        gltf-model="#${props.touch.right.id}"
        ${rightModelScale.tag}
        ${rightModelPosition.tag}
        crossorigin="anonymous"
        preload="true"
        >
        </a-entity>`;
        modelLoaded = "model: false";
      }
    }

    let mesh = ``;

    let soundMarkup = ``;
    if (props.handProp !== undefined && props.handProp.sound !== undefined) {
      soundMarkup = this.buildSound(props.handProp.sound, innerMarkup, childElements, preloadElements, aframeTags);
    }
    if (props.handProp !== undefined && props.handProp.mesh !== undefined) {
      let aframeTags = this.buildTags(props.handProp.mesh)
      let builtMesh = this.buildMesh(props.handProp.mesh, innerMarkup, childElements, preloadElements, aframeTags, soundMarkup);
      mesh = builtMesh.tag;
    }


    let touchContollers = `
    <a-entity
      id="leftHand"
      oculus-touch-controls="hand:left; ${modelLoaded};"
      ${orientationOffsetLeft}
      rotation="0 0 0"
      x-button-listener
      y-button-listener
      left-controller-listener
    >
      ${leftModel}${handProp.leftBox}
    </a-entity>
    <a-entity
      id="rightHand"
      oculus-touch-controls="hand:right; ${modelLoaded};"
      ${orientationOffsetRight}
      rotation="0 0 0"
      a-button-listener
      b-button-listener
      right-controller-listener
    >
      ${rightModel}
      ${debuggerPanelWrist.debuggerPanelWrist}
      ${handProp.rightBox}
    </a-entity>
    ${laser.laser}
    ${handProp.rope}
    ${handProp.objectPositions}
    ${mesh}`;

    return {
      touchContollers: touchContollers,
      preloadElements: preloadElements,
      childElements: childElements,
      innerMarkup: innerMarkup,
    }
  }


  /**
   * Build debugger panel for wrist.
   * @TODO Document
   * @constructor
   */
  buildWristDebugger() {
    // If not in headset, put the panel in view.
    let panelPosition = AFRAME.utils.device.checkHeadsetConnected() ? `position="0.1 0.1 0.1" rotation="-85 0 0"` : `position="0.0 ${this.playerHeight} -0.5"`;
    let debuggerPanelWrist = ``;
    // if ( window.location.hostname !== 'localhost') {
    // if ( window.location.hostname === 'localhost' || AFRAME.utils.device.checkHeadsetConnected() || !AFRAME.utils.device.checkHeadsetConnected()) {
      debuggerPanelWrist = `
      <a-box
        id="debugger-log-vr-bkg"
        height="0.15"
        width="0.15"
        depth="0.005"
        ${panelPosition}
        material="side: back; color: #f44242; transparent: true; opacity: 0.7"
      >
      <a-entity
        id="debugger-log-vr-label"
        material="side: double; color: #ffffff; transparent: true; opacity: 0.7"
        text="value: MESSAGES;
        anchor: center;
        letterSpacing: 10;
        baseline: top;
        width: 0.15;
        font: https://cdn.aframe.io/fonts/Roboto-msdf.json;
        height: 0.05;
        xOffset: 0.001;
        yOffset: 0.001;
        zOffset: 0.001;
        wrap-pixels: 700;
        color: #ffffff"
        position="0 0.07 0"
      ></a-entity>
      <a-entity
        id="debugger-log-vr"
        text="value: ;
        anchor: center;
        baseline: center;
        width: 0.15;
        height: 0.10;
        xOffset: 0.001;
        yOffset: 0.001;
        zOffset: 0.001;
        wrap-pixels: 700;
        color: #eeeeee"
      ></a-entity>
      </a-box>`;
    // }

      debuggerPanelWrist = ``;
    return {
      debuggerPanelWrist: debuggerPanelWrist
    }
  }


  /**
   * Build laser. (@TODO Doesn't work.)
   * @TODO Document
   * @constructor
   */
  buildLaser(props) {
    let laser = ``;
    if (props.laser !== undefined) {
      // Can change hand controller
      let leftLine = this.getProperty("line", props.left);
      let rightLine = this.getProperty("line", props.right);
      laser = `
      <a-entity laser-controls="hand: left" ${leftLine}></a-entity>
      <a-entity laser-controls="hand: right" ${rightLine}></a-entity>`;
    }
    return {
      laser: laser
    }
  }


  /**
   * Build gaze cursor object.
   * @TODO Document
   * @constructor
   */
  buildCursor(props) {
    let cursorCameraControls = `movement-controls="controls: checkpoint"`;
    let cursor = ``;

    if (props.cursorCamera === true) {
      // Add camera cursor
      // cursorCameraControls = `look-controls movement-controls="controls: checkpoint"`;
      cursorCameraControls = `look-controls`;
      cursor = `<a-entity
        cursor="fuse: true"
        material="color: black; shader: flat"
        position="0 0 -3"
        raycaster="objects: ${props.cursorTargetClass};"
        geometry="primitive: ring; radiusInner: 0.08; radiusOuter: 0.1;"
        >
      </a-entity>`;
    }
    return {
      cursorCameraControls: cursorCameraControls,
      cursor: cursor
    }
  }


  /**
   * Build light
   * @TODO Document
   * @constructor
   */
  buildLight(props, innerMarkup, childElements, preloadElements, aframeTags) {
    innerMarkup = `${innerMarkup}
      <a-light ${aframeTags.className}
      type="${props.type ? props.type : "point"}"
       intensity="${props.intensity ? props.intensity : 1}"
       ${aframeTags.color.tag} ${aframeTags.position.tag}>
      </a-light>`;
      return {
        preloadElements: preloadElements,
        childElements: childElements,
        innerMarkup: innerMarkup,
      }
  }


  /**
   * Render scene JSON as AFrame
   * @TODO Document
   * @constructor
   * @param {object} json - Scene object.
   * @returns {object} - Preloaded elements, Aframe markup and Child elements.
   */
  render(json) {
    let innerMarkup = ``;
    let childElements = [];
    let preloadElements = [];

    if (json !== undefined) {
      Object.keys(json).map(item => {
        if (Object.keys(json[item]).length > 0) {
          Object.keys(json[item]).map(propKey => {
            // Set up variables
            let props = json[item][propKey];
            let aframeTags = this.buildTags(props); // @TODO this returns null values if value not set. Keep this way?
            switch (propKey) {
              case "sky":
                props = this.formatDropboxDataRecursive(props); // @TODO Could move this up to app level.
                let sky = this.buildSkybox(props, innerMarkup, childElements, preloadElements, aframeTags);
                innerMarkup = sky.innerMarkup;
                childElements = sky.childElements;
                preloadElements = sky.preloadElements;
                break;
              case "mesh":
                props = this.formatDropboxDataRecursive(props);
                let soundMarkup = ``;
                if (props.sound !== undefined) {
                  soundMarkup = this.buildSound(props.sound, innerMarkup, childElements, preloadElements, aframeTags);
                }

                let mesh = this.buildMesh(props, innerMarkup, childElements, preloadElements, aframeTags, soundMarkup);

                innerMarkup = mesh.innerMarkup;
                childElements = mesh.childElements;
                preloadElements = mesh.preloadElements;
                break;
              case "storyboxes":
                props = this.formatDropboxDataRecursive(props);
                let storyboxes = this.buildStoryboxes(props, innerMarkup, childElements, preloadElements, aframeTags);
                innerMarkup = storyboxes.innerMarkup;
                childElements = storyboxes.childElements;
                preloadElements = storyboxes.preloadElements;
                break;
              case "camera":
                props = this.formatDropboxDataRecursive(props);
                let handPropInterface = buildHandPropInterface(this, props.handProp, innerMarkup, childElements, preloadElements, aframeTags);
                let camera = this.buildCamera(props, innerMarkup, childElements, preloadElements, aframeTags, handPropInterface);
                innerMarkup = camera.innerMarkup;
                childElements = camera.childElements;
                preloadElements = camera.preloadElements;
                break;
              case "light":
                props = this.formatDropboxDataRecursive(props);
                let light = this.buildLight(props, innerMarkup, childElements, preloadElements, aframeTags);
                innerMarkup = light.innerMarkup;
                childElements = light.childElements;
                preloadElements = light.preloadElements;
                break;
              case "audio":
                props = this.formatDropboxDataRecursive(props);
                childElements.push(
                  `<audio id="${props.id}" ${aframeTags.className} preload="auto" crossorigin="anonymous" src="${props.src}" ${aframeTags.position.tag}></audio>`
                );
                break;
              case "image":
                props = this.formatDropboxDataRecursive(props);
                childElements.push(
                  `<img ${aframeTags.className} id="${props.id}" src="${props.art}" crossorigin="anonymous" preload="true" />`
                );
                // HACK: force a quick rotation to easily fix any weirdly oriented skybox art.
                innerMarkup = `${innerMarkup}
                  <a-image ${aframeTags.className} src="#${props.id}" material="alphaTest: 0.5" ${aframeTags.position.tag} ${aframeTags.scale.tag} ${aframeTags.rotation.tag}>
                  </a-image>`;

                break;
              case "imagecube":
                props = this.formatDropboxDataRecursive(props);
                let cube = this.buildCubemap(props);
                cube.map((face, index) => {
                  childElements.push(
                    `<img ${aframeTags.className} id="${props.id}-${index}" src="${
                      face.art
                    }" crossorigin="anonymous" preload="true" />`
                  );

                  innerMarkup = `${innerMarkup}
                    <a-image ${aframeTags.className} src="#${props.id}-${index}" ${
                    face.position
                  } ${aframeTags.scale.tag} ${face.rotation}></a-image>`;
                });
                break;
              case "text":
                props = this.formatDropboxDataRecursive(props);
                innerMarkup = `${innerMarkup}
                  <a-entity ${aframeTags.text.tag} ${aframeTags.position.tag}  ${aframeTags.rotation.tag} ${aframeTags.scale.tag}></a-entity>`;
                break;
              case "box":
                props = this.formatDropboxDataRecursive(props);
                if (props.type !== undefined && props.type === "button") {
                  innerMarkup = `${innerMarkup}
                    <a-box
                      ${aframeTags.className}
                      ${aframeTags.color.tag}
                      data-clickable
                      cursor-listener
                      visible="true"
                      id="${props.id}"
                      ${aframeTags.position.tag}
                      ${aframeTags.rotation.tag}
                      ${aframeTags.dimensions.tag}
                      event-set__click="${props.click}"
                      event-set__mouseenter="${props.mouseenter}"
                      event-set__mouseleave="${props.mouseleave}"
                      sound="${props.sound}"
                    >
                    </a-box>`;
                } else {
                  innerMarkup = `${innerMarkup}
                  <a-box
                    id="${props.id}"
                    ${aframeTags.className}
                    ${aframeTags.color.tag}
                    ${aframeTags.position.tag}
                    ${aframeTags.rotation.tag}
                    ${aframeTags.dimensions.tag}
                  >
                  </a-box>`;
                }
            }
            innerMarkup = `${innerMarkup}`;
          });
        }
      });

      return {
        childElements: childElements,
        innerMarkup: innerMarkup,
        preloadElements: preloadElements,
      };
    }
  }
}

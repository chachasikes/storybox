import { formatDropboxRawLinks  } from './utilities/dropbox-format.js';
import { buildHandPropInterface } from './components/accordion-stretch.js';

/**
 * Build AFrame markup from JSON settings.
 * @module StoryboxAframe
 */
export class StoryboxAframe {
  constructor() {
    this.getCoordinates = this.getCoordinates.bind(this);
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
   * @param {object} data - the values for the item
   */
  formatDropboxDataRecursive(data)  {
    let propKeys = Object.keys(data);
    for (let i=0; i < propKeys.length; i++) {
      let propKey = propKeys[i];
      switch(propKey) {
        // All tags that need conversion
        // @TODO there may be some tags not converted. Check.
        case 'art':
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
   * @param {string} name - the attribute name to look up in data
   * @param {object} data - the values for the item
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
   * @param {object} data - the values for the item
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
   * @param {object} data - the values for the item
   */
  getCoordinates(name, data) {
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
   * @param {object} data - the values for the item
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
   * Compose a cube map with individual images.
   *
   * @param {object} data - the values for the item
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

   * @returns {number}
   */
  getCube(data) {
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
   * @constructor
   * @param {object} props - The JSON Settings.
   * @param {string} innerMarkup - The current AFrame markup insert
   * @param {array} childElements - The items to insert into <a-assets> tag for preloading.
   * @param {array} preloadElements - The current AFrame markup insert
   * @param {object} aframeTags - Composed attribute tags to insert as AFrame options
   * @returns {object} -
   */
  buildSky(props, innerMarkup, childElements, preloadElements, aframeTags) {
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

  /**
   * Given JSON settings, output a mesh object.
   * JSON Parameters
   * @constructor
   * @param {object} props - The JSON Settings.
   * @param {string} props.art - The JSON Settings.
   * @param {string} innerMarkup - The current AFrame markup insert
   * @param {array} childElements - The current AFrame markup insert
   * @param {array} preloadElements - The current AFrame markup insert
   * @param {object} aframeTags - Composed attribute tags to insert as AFrame options
   */
  buildMesh(props, innerMarkup, childElements, preloadElements, aframeTags) {
    if (props.art !== undefined) {
      let fileType = props.art.split('.').pop();
      let classProps = this.getValue("className", props);
      let className = `class="${classProps.attribute} glb-animation"`;
      // console.log('texture', props.texture);
      let texture = props.texture !== undefined ? `gltf-material="path:${props.texture}"` : ``;
      let opacity = props.opacity !== undefined ? `gltf-model-opacity="${props.opacity}"` : ``;
      let glb_legacy = props.glb_legacy !== undefined ? props.glb_legacy : false;

      if (fileType === 'glb') {
        className = `class="glb-animation ${classProps.attribute} ${props.texture !== undefined ? 'textured' : ''}"`;

        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        preloadElements.push(
          `<a-asset-item ${aframeTags.className} id="${props.id}" src="${props.art}" preload="auto" loaded></a-asset-item>`
        );
        // Support GLTF 1.0 and 2.0. Tiltbrush exports glb1, which need to be renamed as glb
        let gltf_model = glb_legacy ? 'gltf-model-legacy' : 'gltf-model';

        innerMarkup = `${innerMarkup}
          <a-entity
          id="${props.id}-gltf"
          ref="${props.id}"
          ${className}
          ${gltf_model}="#${props.id}"
          ${opacity}
          ${texture}
          ${aframeTags.scale.tag}
          ${aframeTags.position.tag}
          ${aframeTags.rotation.tag}
          crossorigin="anonymous"
          preload="true"
          animation-mixer
          >
          </a-entity>
          `;
      } else if (fileType === 'obj') {

        preloadElements.push(
          `<a-asset-item ${aframeTags.className} id="${props.id}" src="${props.art}" preload="auto" loaded></a-asset-item>
           <a-asset-item id="${props.id}-material" src="${props.material}"></a-asset-item>
          `
        );

        innerMarkup = `${innerMarkup}
          <a-obj-model
          src="#${props.id}"
          mtl="#${props.id}-material"
          crossorigin="anonymous"
          preload="true"
          >
          </a-obj-model>`;
      }
    }

    return {
      childElements,
      innerMarkup,
      preloadElements
    }
  }

  buildStoryboxes(props, innerMarkup, childElements, preloadElements, aframeTags) {
    return {
      childElements,
      innerMarkup,
      preloadElements
    }
  }

  buildTags(props) {
    let scale = this.getCoordinates("scale", props);
    let rotation = this.getCoordinates("rotation", props);
    let position = this.getCoordinates("position", props);
    let offset = this.getCoordinates("offset", props);
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

  buildHead(props) {
    return {
      head: `
      <a-sphere render-order="head" intersection-play="" class="head" id="head" radius="0.2">
      </a-sphere>
      `
    }
  }

  buildCamera(props, innerMarkup, childElements, preloadElements, aframeTags, handProp) {
    let cursor = this.buildCursor(props);
    let touchContollers = this.buildTouchControllers(props, handProp, preloadElements, aframeTags);
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

  buildTouchControllers(props, handProp, preloadElements, aframeTags) {
    let leftModel = ``;
    let rightModel = ``;
    let orientationOffsetLeft = ``;
    let orientationOffsetRight = ``;
    let modelLoaded = "model: false";
    let debuggerPanelWrist = {debuggerPanelWrist: ``};
    let laser = this.buildLaser(props);

    debuggerPanelWrist = this.buildWristDebugger();

    // @TODO split out
    if (props.touch !== undefined) {

      // https://aframe.io/docs/0.9.0/introduction/interactions-and-controllers.html
      // Can change hand controller
      if (props.touch.left.glb !== undefined) {
        props.touch.left = this.formatDropboxDataRecursive(props.touch.left);
        let leftModelScale = this.getCoordinates(
          "scale",
          props.touch.left
        );
        let leftModelPosition = this.getCoordinates(
          "position",
          props.touch.left
        );
        let leftModelRotation = this.getCoordinates(
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
        let rightModelScale = this.getCoordinates(
          "scale",
          props.touch.right
        );
        let rightModelPosition = this.getCoordinates(
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
    ${handProp.objectPositions}`;

    return {
      touchContollers: touchContollers
    }
  }

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
    return {
      debuggerPanelWrist: debuggerPanelWrist
    }
  }

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
        raycaster="objects: ${props.clickableClass};"
        geometry="primitive: ring; radiusInner: 0.08; radiusOuter: 0.1;"
        >
      </a-entity>`;
    }
    return {
      cursorCameraControls: cursorCameraControls,
      cursor: cursor
    }
  }

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

  // Format json object as a-frame
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
            let aframeTags = this.buildTags(props);
            switch (propKey) {
              case "sky":
                props = this.formatDropboxDataRecursive(props);
                let sky = this.buildSky(props, innerMarkup, childElements, preloadElements, aframeTags);
                innerMarkup = sky.innerMarkup;
                childElements = sky.childElements;
                preloadElements = sky.preloadElements;
                break;
              case "mesh":
                props = this.formatDropboxDataRecursive(props);
                let mesh = this.buildMesh(props, innerMarkup, childElements, preloadElements, aframeTags);
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
                let cube = this.getCube(props);
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
              // case "text-geometry":
              //   props = this.formatDropboxDataRecursive(props);
              //   innerMarkup = `${innerMarkup}
              //     <a-entity ${aframeTags.text.tag} ${aframeTags.position.tag} ${aframeTags.rotation.tag} ${aframeTags.scale.tag}></a-entity>`;
              //   break;
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

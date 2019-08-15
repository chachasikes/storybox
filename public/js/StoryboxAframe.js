import { formatDropboxRawLinks  } from './utilities.js';
import { buildHandPropInterface } from './interfaceAccordion.js';

export class StoryboxAframe {
  constructor() {
    this.getAxis = this.getAxis.bind(this);
    this.getValue = this.getValue.bind(this);
    this.playerHeight = 1.6;
    this.playerArmOffset = -0.5;
    this.materials = {};
  }

  // Make tags or properties for aframe
  getValue(label, data) {
    if (data !== undefined && data[label] !== undefined) {
      return {
        tag: `${label}="${data[label]}"`,
        attribute: `${data[label]}`
      };
    }
    return {
      tag: ``,
      attribute: ``
    };
  }

  formatDropboxDataRecursive(data)  {
    // For each data item, look for .art or other assets & change any dropbox links to the correct version.
    // console.log(data);
    let propKeys = Object.keys(data);
    for (let i=0; i < propKeys.length; i++) {
      let propKey = propKeys[i];
      switch(propKey) {
        case 'art':
        case 'panel':
        case 'material':
        case 'texture':
          // console.log(propKey);
          if (typeof data[propKey].replace === 'function') {
            data[propKey] = data[propKey].replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');
          }
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

    // This is the path to downloadable dropbox assets. Cannot have dl=0 & must be the user content URL.
    // This allows for simple hosting for low traffic assets. Higher traffic assets would need to be hosted elsewhere.
    // return url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');

    return data;
  }

  getProperties(label, data) {
    if (data !== undefined && data[label] !== undefined) {
      let props = data[label];
      let options = ``;
      Object.keys(props).map(prop => {
        options = `${options}${prop}=${props[prop]};`;
      });
      return `${label}=${options}`;
    }
    return ``;
  }

  // Make tags or properties for aframe, multiple dimensions
  getAxis(label, data) {
    if (
      data !== undefined &&
      data[label] !== undefined &&
      data[label].x !== undefined &&
      data[label].y !== undefined &&
      data[label].z !== undefined
    ) {
      return {
        tag: `${label}="${data[label].x} ${data[label].y} ${data[label].z}"`,
        attributes: `${data[label].x} ${data[label].y} ${data[label].z}`
      };
    }
    return {
      tag: ``,
      attributes: ``
    };
  }

  getDimensions(label, data) {
    if (
      data !== undefined &&
      data[label] !== undefined &&
      data[label].width !== undefined &&
      data[label].height !== undefined &&
      data[label].depth !== undefined
    ) {
      return {
        tag: `width="${data[label].width}" height="${
          data[label].height
        }" depth="${data[label].depth}"`,
        attributes: `${data[label].width} ${data[label].height} ${
          data[label].depth
        }`
      };
    }
    return ``;
  }

  getCube(data) {
    // @TODO see also cube-map-env aframe extras <a-box cube-map-env src="https://dl.dropboxusercontent.com/s/q5sndy1rk2drufh/hand-drawn--bake1.jpg" position="2 0.5 -4"></a-box>
    let cube = [
      {
        position: `position="${data.position.x} ${data.position.y} ${data
          .position.z -
          data.scale.z / 2}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y} ${
          data.rotation.z
        }"`,
        art: typeof data.art === "object" ? data.art.back : data.art
      },
      {
        position: `position="${data.position.x} ${data.position.y} ${data
          .position.z +
          data.scale.z / 2}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y} ${
          data.rotation.z
        }"`,
        art: typeof data.art === "object" ? data.art.front : data.art
      },
      {
        position: `position="${data.position.x} ${data.position.y -
          data.scale.y / 2} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x - 90} ${data.rotation.y} ${
          data.rotation.z
        }"`,
        art: typeof data.art === "object" ? data.art.bottom : data.art
      },
      {
        position: `position="${data.position.x} ${data.position.y +
          data.scale.y / 2} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x + 90} ${data.rotation.y} ${
          data.rotation.z
        }"`,
        art: typeof data.art === "object" ? data.art.top : data.art
      },
      {
        position: `position="${data.position.x - data.scale.x / 2} ${
          data.position.y
        } ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y - 90} ${
          data.rotation.z
        }"`,
        art: typeof data.art === "object" ? data.art.left : data.art
      },
      {
        position: `position="${data.position.x + data.scale.x / 2} ${
          data.position.y
        } ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y + 90} ${
          data.rotation.z
        }"`,
        art: typeof data.art === "object" ? data.art.right : data.art
      }
    ];
    return cube;
  }

  buildSky(props, innerMarkup, assetsElements, assetItemElements, aframeTags) {
    if (props.color !== undefined) {
      innerMarkup = `${innerMarkup}<a-sky color="${
        aframeTags.color.attribute
      }"></a-sky>`;
    } else if (
      props.color === undefined &&
      props.art !== undefined &&
      props.id !== undefined
    ) {
      assetsElements.push(
        `<img ${aframeTags.className} id="${props.id}" src="${
          props.art
        }" crossorigin="anonymous" preload="true" />`
      );

      // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
      innerMarkup = `${innerMarkup}
        <a-sky ${aframeTags.className} src="#${props.id}" ${
        aframeTags.color.attribute
      } animation="property: rotation; to: ${
        aframeTags.rotation.attributes
      }; dur: 10" preload="auto"
        animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
        animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade">
        </a-sky>`;
    }

    return {
      assetsElements,
      innerMarkup,
      assetItemElements
    }
  }

  buildMesh(props, innerMarkup, assetsElements, assetItemElements, aframeTags) {
    if (props.art !== undefined) {
      let classProps = this.getValue("className", props);
      let className = `class="${classProps.attribute} glb-animation"`;

      let texture = props.texture !== undefined ? `gltf-material="${props.texture}"` : ``;
      let opacity = props.opacity !== undefined ? `model-opacity="${props.opacity}"` : ``;

      let fileType = props.art.split('.').pop();
      if (fileType === 'glb') {
        className = `class="glb-animation ${classProps.attribute} ${props.texture !== undefined && props.texture !== undefined ? 'textured' : ''}"`;

        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        assetItemElements.push(
          `<a-asset-item ${aframeTags.className} id="${props.id}" src="${props.art}" preload="auto" loaded></a-asset-item>`
        );

        // https://github.com/donmccurdy/aframe-extras/issues/167

        // var textureMaterial = new THREE.TextureLoader().load( `${props.art}` );
        // textureMaterial.flipY = false;
        // this.materials[props.id] = new THREE.MeshStandardMaterial({
        //     map: textureMaterial,
        //     color : 0x000000,
        //     side: "double",
        //     alphaTest: 100,
        //     flatShading: true,
        //     transparent: true,
        //     opacity: 0.5,
        //     fog: false,
        // });


        // @TODO texture
        innerMarkup = `${innerMarkup}
          <a-entity
          id="#${props.id}-gltf"
          ref="${props.id}"
          ${className}
          gltf-model="#${props.id}"
          ${opacity}
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
        assetItemElements.push(
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
      assetsElements,
      innerMarkup,
      assetItemElements
    }
  }

  buildStoryboxes(props, innerMarkup, assetsElements, assetItemElements, aframeTags) {
    return {
      assetsElements,
      innerMarkup,
      assetItemElements
    }
  }

  buildTags(props) {
    let scale = this.getAxis("scale", props);
    let rotation = this.getAxis("rotation", props);
    let position = this.getAxis("position", props);
    let offset = this.getAxis("offset", props);
    let color = this.getValue("color", props);
    let text = this.getValue("text", props);
    let dimensions = this.getDimensions("dimensions", props);
    let classProps = this.getValue("className", props);
    let className = `class="${classProps.attribute}"`;
    let line = this.getProperties("line", props);

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
      head: `<a-sphere intersection-play="" id="head" radius="1.5" color="pink" position="1 1 -1" material="color: black; shader: flat; transparent: true; opacity: 0.6; side: double"></a-sphere>`
    }
  }

  buildCamera(props, innerMarkup, assetsElements, assetItemElements, aframeTags, handProp) {
    let cursor = this.buildCursor(props);
    let touchContollers = this.buildTouchControllers(props, handProp, assetItemElements, aframeTags);
    let headBox = this.buildHead(props);
    innerMarkup = `${innerMarkup}
    <a-entity
      id="rig"
      ${aframeTags.position.tag}
      ${aframeTags.rotation.tag}
      ${aframeTags.scale.tag}
      updateTestPosition="${props.testUpdateFunction}"
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
      assetItemElements: assetItemElements,
      assetsElements: assetsElements,
      innerMarkup: innerMarkup,
    }
  }

  buildTouchControllers(props, handProp, assetItemElements, aframeTags) {
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
        let leftModelScale = this.getAxis(
          "scale",
          props.touch.left
        );
        let leftModelPosition = this.getAxis(
          "position",
          props.touch.left
        );
        let leftModelRotation = this.getAxis(
          "rotation",
          props.touch.left
        );

        if (props.touch.left.orientationOffset !== undefined) {
          orientationOffsetLeft = `offsetOrientation="${props.touch.left.orientationOffset}"`;
        }
        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        assetItemElements.push(
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
        let rightModelScale = this.getAxis(
          "scale",
          props.touch.right
        );
        let rightModelPosition = this.getAxis(
          "position",
          props.touch.right
        );

        if (props.touch.right.orientationOffset !== undefined) {
          orientationOffsetRight = `offsetOrientation="${props.touch.right.orientationOffset}"`;
        }
        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        assetItemElements.push(
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
      tickFunction="${handProp.left.tickFunction}"
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
      tickFunction="${handProp.right.tickFunction}"
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
      let leftLine = this.getProperties("line", props.left);
      let rightLine = this.getProperties("line", props.right);
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

  buildLight(props, innerMarkup, assetsElements, assetItemElements, aframeTags) {
    innerMarkup = `${innerMarkup}
      <a-light ${aframeTags.className} type="${
      props.type ? props.type : "point"
    }" ${aframeTags.color.tag} ${aframeTags.position.tag}>
      </a-light>`;
      return {
        assetItemElements: assetItemElements,
        assetsElements: assetsElements,
        innerMarkup: innerMarkup,
      }
  }

  // Format json object as a-frame
  render(json) {
    let innerMarkup = ``;
    let assetsElements = [];
    let assetItemElements = [];

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
                let sky = this.buildSky(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = sky.innerMarkup;
                assetsElements = sky.assetsElements;
                assetItemElements = sky.assetItemElements;
                break;
              case "mesh":
                props = this.formatDropboxDataRecursive(props);
                let mesh = this.buildMesh(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = mesh.innerMarkup;
                assetsElements = mesh.assetsElements;
                assetItemElements = mesh.assetItemElements;
                break;
              case "storyboxes":
                props = this.formatDropboxDataRecursive(props);
                let storyboxes = this.buildStoryboxes(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = storyboxes.innerMarkup;
                assetsElements = storyboxes.assetsElements;
                assetItemElements = storyboxes.assetItemElements;
                break;
              case "camera":
                props = this.formatDropboxDataRecursive(props);
                let handPropScent = buildHandPropInterface(this, props.handProp, innerMarkup, assetsElements, assetItemElements, aframeTags);
                let camera = this.buildCamera(props, innerMarkup, assetsElements, assetItemElements, aframeTags, handPropScent);
                innerMarkup = camera.innerMarkup;
                assetsElements = camera.assetsElements;
                assetItemElements = camera.assetItemElements;
                break;
              case "light":
                props = this.formatDropboxDataRecursive(props);
                let light = this.buildLight(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = light.innerMarkup;
                assetsElements = light.assetsElements;
                assetItemElements = light.assetItemElements;
                break;
              case "audio":
                props = this.formatDropboxDataRecursive(props);
                assetsElements.push(
                  `<audio id="${props.id}" ${aframeTags.className} preload="auto" crossorigin="anonymous" src="${props.src}" ${aframeTags.position.tag}></audio>`
                );
                break;
              case "image":
                props = this.formatDropboxDataRecursive(props);
                assetsElements.push(
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
                  assetsElements.push(
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
        assetsElements: assetsElements,
        innerMarkup: innerMarkup,
        assetItemElements: assetItemElements,
      };
    }
  }
}

export class StoryboxAframe {
  constructor() {
    this.getAxis = this.getAxis.bind(this);
    this.getValue = this.getValue.bind(this);
    this.playerHeight = 1.6;
    this.playerArmOffset = -0.5;
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

    Object.keys(data).forEach(propKey => {
      switch(propKey) {
        case 'art':
        case 'panel':
        case 'material':
          // console.log(propKey);
          // console.log(data[propKey]);
          data[propKey] = data[propKey].replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');
        break;
      }
    })

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

      let texture = props.texture !== undefined && props.texture.art !== undefined ? `src="${props.texture.art}"` : ``;

      let fileType = props.art.split('.').pop();
      if (fileType === 'glb') {
        className = `class="${classProps.attribute} glb-animation"`;

        // https://aframe.io/docs/0.9.0/components/gltf-model.html
        assetItemElements.push(
          `<a-asset-item ${aframeTags.className} id="${props.id}" src="${props.art}" preload="auto" loaded></a-asset-item>`
        );

        innerMarkup = `${innerMarkup}
          <a-entity
          ${aframeTags.className}
          gltf-model="#${props.id}"
          ${aframeTags.scale.tag}
          ${aframeTags.position.tag}
          ${texture}
          crossorigin="anonymous"
          preload="true"
          animation-mixer
          >
          </a-entity>`;
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

  buildCamera(props, innerMarkup, assetsElements, assetItemElements, aframeTags, handProp) {
    let leftModel = ``;
    let rightModel = ``;
    let orientationOffsetLeft = ``;
    let orientationOffsetRight = ``;
    let modelLoaded = "model: true";

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

    // @TODO split out
    // If not in headset, put the panel in view.
    let panelPosition = AFRAME.utils.device.checkHeadsetConnected() ? `position="0.1 0.1 0.1" rotation="-85 0 0"` : `position="0.0 ${this.playerHeight} -0.5"`;
    let debuggerPanelWrist = ``;
    if ( window.location.hostname !== 'localhost') {
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
  }

    let touchContollers = `
    <a-entity id="leftHand" oculus-touch-controls="hand:left; ${modelLoaded};" ${orientationOffsetLeft} rotation="0 0 0" x-button-listener y-button-listener left-controller-listener>${leftModel}${handProp.leftBox}</a-entity>
    <a-entity id="rightHand" oculus-touch-controls="hand:right; ${modelLoaded};" ${orientationOffsetRight} rotation="0 0 0" a-button-listener b-button-listener right-controller-listener>${rightModel}${debuggerPanelWrist}${handProp.rightBox}</a-entity>
    ${handProp.rope}
    ${handProp.objectPositions}`;

    if (props.laser !== undefined) {
      // Can change hand controller
      let leftLine = this.getProperties("line", props.left);
      let rightLine = this.getProperties("line", props.right);
      innerMarkup = `${innerMarkup}<a-entity laser-controls="hand: left" ${leftLine}></a-entity><a-entity laser-controls="hand: right" ${rightLine}></a-entity>`;
    }

    // @TODO split out
    let cursorCameraControls = `movement-controls="controls: checkpoint"`;
    let cursor = ``;

    if (props.cursorCamera === true) {
      // Add camera cursor
      cursorCameraControls = `look-controls movement-controls="controls: checkpoint"`;
      cursor = `<a-entity
        cursor="fuse: true"
        material="color: black; shader: flat"
        position="0 0 -3"
        raycaster="objects: ${props.clickableClass};"
        geometry="primitive: ring; radiusInner: 0.08; radiusOuter: 0.1;"
        >
      </a-entity>`;
    }

    innerMarkup = `${innerMarkup}
    <a-entity id="rig" ${aframeTags.position.tag} ${aframeTags.rotation.tag} ${aframeTags.scale.tag}>
        <a-camera ${aframeTags.className} id="${props.id}" ${cursorCameraControls} position="0 ${this.playerHeight} 0">
        ${cursor}
        </a-camera>
        ${touchContollers}
    </a-entity>
    `;

    return {
      assetItemElements: assetItemElements,
      assetsElements: assetsElements,
      innerMarkup: innerMarkup,
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

  stretchPosition(a, b, item) {
    // Figure out where on the axes this object should appear.
    // Figure out the percentages to use to project the object along another line.
    let position = item; // The object.

    let locationX = Math.abs(a.x) + item.position.x;
    let locationY = Math.abs(a.y) + item.position.y;
    let locationZ = Math.abs(a.z) + item.position.z;

    let divisorX = Math.abs(b.x) + Math.abs(a.x);
    let divisorY = Math.abs(b.y) + Math.abs(a.y);
    let divisorZ = Math.abs(b.z) + Math.abs(a.z);

    let percentageX = divisorX === 0 ? locationX : locationX / divisorX;
    let percentageY = divisorY === 0 ? locationY : locationY / divisorY;
    let percentageZ = divisorZ === 0 ? locationZ : locationZ / divisorZ;
    
    position.percentageX = percentageX;
    position.percentageY = percentageY;
    position.percentageZ = percentageZ;
    return position;
  }

  updateStretchPosition(a, b, item) {
    let percentageX = parseFloat(item.getAttribute('data-percentage-x'));
    let percentageY = parseFloat(item.getAttribute('data-percentage-y'));
    let percentageZ = parseFloat(item.getAttribute('data-percentage-z'));

    let data = {
      x: ((Math.abs(b.x) + Math.abs(a.x)) * percentageX) + a.x,
      y: ((Math.abs(b.y) + Math.abs(a.y)) * percentageY) + a.y,
      z: ((Math.abs(b.z) + Math.abs(a.z)) * percentageZ) + a.z,
    };
    return data;
  }

  buildHandPropInterface(props, innerMarkup, assetsElements, assetItemElements, aframeTags) {
    let rope = ``;
    let objectPositions = ``;
    let leftBox = ``;
    let rightBox = ``;
    if (props !== undefined && props.type === 'stretch') {

    if (!AFRAME.utils.device.checkHeadsetConnected()) {
      props.a.position = {
        x: this.playerArmOffset,
        y: this.playerHeight,
        z: this.playerArmOffset,
      };
      props.b.position = {
        x: this.playerArmOffset,
        y: this.playerHeight,
        z: this.playerArmOffset,
      };

      props.positions.forEach(item => {
        item.position.x = item.position.x - (this.playerArmOffset * -1) ;
        item.position.y = item.position.y - this.playerHeight;
        item.position.z = item.position.z - (this.playerArmOffset * -1);
        return item;
      });
    }

      let aTags = this.buildTags(props.a);
      let bTags = this.buildTags(props.b);

      leftBox = `
      <a-box
        id="${props.a.id}"
        ${aTags.className}
        ${aTags.color.tag}
        ${aTags.position.tag}
        ${aTags.rotation.tag}
        ${aTags.dimensions.tag}
      >
      </a-box>
      `;

      rightBox = `
      <a-box
        id="${props.b.id}"
        ${bTags.className}
        ${bTags.color.tag}
        ${bTags.position.tag}
        ${bTags.rotation.tag}
        ${bTags.dimensions.tag}
      >
      </a-box>
      `;

      let ropeBox = `
      <a-box
        id="${props.id}"
        ${aframeTags.className}
        ${aframeTags.color.tag}
        ${aframeTags.dimensions.tag}
      >
      </a-box>
      `;

      if( props.positions !== undefined ) {
        // console.log(props.positions);
        props.positions.forEach(item => {
          let obj = this.stretchPosition(props.a.position, props.b.position, item);
          objectPositions = `${objectPositions}
          <a-sphere
          id="${item.id}"
          class="stretch-object"
          position="${obj.position.x} ${obj.position.y} ${obj.position.z}"
          data-percentage-x="${obj.percentageX}"
          data-percentage-y="${obj.percentageY}"
          data-percentage-z="${obj.percentageZ}"
          radius="0.05"
          color="${item.color}"
          material="shader:flat"
          ></a-sphere>`;
        });
      }

      rope = `<a-entity id="${props.id}"
      line="start: ${props.a.position.x}, ${props.a.position.y}, ${props.a.position.z}; end: ${props.b.position.x}, ${props.b.position.y}, ${props.b.position.z}; color: ${props.ropeColor}"
      ></a-entity>`;

      innerMarkup = `${innerMarkup}${rope}${leftBox}${rightBox}${objectPositions}`;

    }

    return {
      assetItemElements: assetItemElements,
      assetsElements: assetsElements,
      innerMarkup: innerMarkup,
      rope: rope,
      leftBox: leftBox,
      rightBox: rightBox,
      objectPositions: objectPositions
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
              case "camera":
                props = this.formatDropboxDataRecursive(props);
                let handPropScent = this.buildHandPropInterface(props.handProp, innerMarkup, assetsElements, assetItemElements, aframeTags);
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

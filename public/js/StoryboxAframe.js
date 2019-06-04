export class StoryboxAframe {
  constructor() {
    this.getAxis = this.getAxis.bind(this);
    this.getValue = this.getValue.bind(this);
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
        crossorigin="anonymous"
        preload="true"
        animation-mixer
        >
        </a-entity>`;
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

  buildCamera(props, innerMarkup, assetsElements, assetItemElements, aframeTags, scent) {
    let leftModel = ``;
    let rightModel = ``;
    let orientationOffsetLeft = ``;
    let orientationOffsetRight = ``;
    let modelLoaded = "model: true";
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
    // If not in headset, put the panel in view.
    let panelPosition = !AFRAME.utils.checkHeadsetConnected() ? `position="0.0 1.6 -0.5"` : `position="0.14 0.08 0.14" rotation="85 -15 -15"`;
    let debuggerPanelWrist = ``;
    if ( window.location.hostname === 'localhost' ) {
      debuggerPanelWrist = `
      <a-box
        id="debugger-log-vr-bkg"
        height="0.1"
        width="0.1"
        depth="0.01"
        ${panelPosition}
        material="side: double; color: #af1c92; transparent: true; opacity: 0.7"
      >
      <a-entity
        id="debugger-log-vr"
        text="value: Log;
        anchor: center;
        baseline: center;
        width: 0.1;
        height: 0.1;
        xOffset: 0.01;
        yOffset: 0.01;
        zOffset: 0.01;
        color: #efefef"
      ></a-entity>
      </a-box>`;
    }

    let touchContollers = `
    <a-entity id="leftHand" oculus-touch-controls="hand:left; ${modelLoaded};" ${orientationOffsetLeft} rotation="0 0 0">${leftModel}${scent.leftBox}</a-entity>
    <a-entity id="rightHand" oculus-touch-controls="hand:right; ${modelLoaded};" ${orientationOffsetRight} rotation="0 0 0">${rightModel}${debuggerPanelWrist}${scent.rightBox}</a-entity>
    ${scent.rope}${scent.objectPositions}`;

    if (props.laser !== undefined) {
      // Can change hand controller
      let leftLine = this.getProperties("line", props.left);
      let rightLine = this.getProperties("line", props.right);
      innerMarkup = `${innerMarkup}<a-entity laser-controls="hand: left" ${leftLine}></a-entity><a-entity laser-controls="hand: right" ${rightLine}></a-entity>`;
    }

    let cursorCameraControls = ``;
    let cursor = ``;
    if (props.cursorCamera === true) {
      // Add camera cursor
      // console.log("Setting up Cursor Camera", props);
      cursorCameraControls = `look-controls wasd-controls`;
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
    <a-entity id="rig" ${aframeTags.position.tag}>
        <a-camera ${aframeTags.className} id="${props.id}" ${cursorCameraControls} position="0 1.6 0">
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
    let position = item;
    let percentageX = (Math.abs(a.x) + item.x) / (Math.abs(b.x) + Math.abs(a.x)) ;
    let percentageY = (Math.abs(a.y) + item.y) / (Math.abs(b.y) + Math.abs(a.y)) ;
    let percentageZ = (Math.abs(a.z) + item.z) / (Math.abs(b.z) + Math.abs(a.z)) ;
    // console.log("original %", percentageX, percentageY, percentageZ);
    let x = item.x;
    let y = item.y;
    let z = item.z;
    return {
      x,
      y,
      z,
      percentageX,
      percentageY,
      percentageZ
    }
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
    // console.log('data', data, percentageY, a, b);
    return data;
  }

  buildScentInterface(props, innerMarkup, assetsElements, assetItemElements, aframeTags) {
    let rope = ``;
    let objectPositions = ``;
    let leftBox = ``;
    let rightBox = ``;
    if (props !== undefined && props.type === 'stretch') {
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
        props.positions.forEach(item => {
          let obj = this.stretchPosition(props.a.position, props.b.position, item);
          // console.log('strpos obj', obj);
          objectPositions = `${objectPositions}<a-sphere id="${item.id}"class="stretch-object" position="${obj.x} ${obj.y} ${obj.z}"
          data-percentage-x="${obj.percentageX}"
          data-percentage-y="${obj.percentageY}"
          data-percentage-z="${obj.percentageZ}"
          radius="4" color="${item.color}"></a-sphere>`;
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
                let sky = this.buildSky(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = sky.innerMarkup;
                assetsElements = sky.assetsElements;
                assetItemElements = sky.assetItemElements;
                break;
              case "mesh":
                let mesh = this.buildMesh(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = mesh.innerMarkup;
                assetsElements = mesh.assetsElements;
                assetItemElements = mesh.assetItemElements;
                break;
              case "camera":
                let scent = this.buildScentInterface(props.scent, innerMarkup, assetsElements, assetItemElements, aframeTags);
                let camera = this.buildCamera(props, innerMarkup, assetsElements, assetItemElements, aframeTags, scent);
                innerMarkup = camera.innerMarkup;
                assetsElements = camera.assetsElements;
                assetItemElements = camera.assetItemElements;
                break;
              case "light":
                let light = this.buildLight(props, innerMarkup, assetsElements, assetItemElements, aframeTags);
                innerMarkup = light.innerMarkup;
                assetsElements = light.assetsElements;
                assetItemElements = light.assetItemElements;
                break;
              case "audio":
                assetsElements.push(
                  `<audio id="${props.id}" ${aframeTags.className} preload="auto" crossorigin="anonymous" src="${props.src}" ${aframeTags.position.tag}></audio>`
                );
                break;
              case "image":
                assetsElements.push(
                  `<img ${aframeTags.className} id="${props.id}" src="${props.art}" crossorigin="anonymous" preload="true" />`
                );
                // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
                innerMarkup = `${innerMarkup}
                  <a-image ${aframeTags.className} src="#${props.id}" material="alphaTest: 0.5" ${aframeTags.position.tag} ${aframeTags.scale.tag} ${aframeTags.rotation.tag}>
                  </a-image>`;
                break;
              case "imagecube":
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
                innerMarkup = `${innerMarkup}
                  <a-entity ${aframeTags.text.tag} ${aframeTags.position.tag} ${aframeTags.scale.tag}></a-entity>`;
                break;
              case "box":
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

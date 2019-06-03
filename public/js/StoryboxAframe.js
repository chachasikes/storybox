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

  playGLTFAnimation(e) {
    console.log(e, "playing gltf animation");
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
            switch (propKey) {
              case "sky":
                if (props.color !== undefined) {
                  innerMarkup = `${innerMarkup}<a-sky color="${
                    color.attribute
                  }"></a-sky>`;
                } else if (
                  props.color === undefined &&
                  props.art !== undefined &&
                  props.id !== undefined
                ) {
                  assetsElements.push(
                    `<img ${className} id="${props.id}" src="${
                      props.art
                    }" crossorigin="anonymous" preload="true" />`
                  );

                  // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
                  innerMarkup = `${innerMarkup}
                    <a-sky ${className} src="#${props.id}" ${
                    color.attribute
                  } animation="property: rotation; to: ${
                    rotation.attributes
                  }; dur: 10" preload="auto"
                    animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
                    animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade">
                    </a-sky>`;
                }
                break;
              case "mesh":
                if (props.art !== undefined) {
                  // https://aframe.io/docs/0.9.0/components/gltf-model.html
                  assetItemElements.push(
                    `<a-asset-item ${className} id="${props.id}" src="${props.art}" preload="auto" loaded></a-asset-item>`
                  );

                  innerMarkup = `${innerMarkup}
                    <a-entity
                    ${className}
                    gltf-model="#${props.id}"
                    ${scale.tag}
                    ${position.tag}
                    crossorigin="anonymous"
                    preload="true"
                    animation-mixer
                    >
                    </a-entity>`;
                }
                break;
              case "camera":
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
                    ${className}
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
                    ${className}
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

                let debuggerLog = `<a-entity id="debugger-log-vr" text="value: (log); width: 0.5; height: 0.5; color: #ffffff" position="0 -1 0.01"></a-entity>`;

                let debuggerPanel = `${debuggerLog}
                <a-box id="debugger-log-vr-bkg"
                  height="0.5"
                  width="0.5"
                  depth="0.05"
                  position="0 -1 0"
                  material="side: double; color: #EF2D5E; transparent: true; opacity: 0.7"
                ></a-box>`;

                let touchContollers = `
                <a-entity id="leftHand" oculus-touch-controls="hand:left; ${modelLoaded};" ${orientationOffsetLeft} rotation="0 0 0">${leftModel}</a-entity>
                <a-entity id="rightHand" oculus-touch-controls="hand:right; ${modelLoaded};" ${orientationOffsetRight} rotation="0 0 0">${rightModel}${debuggerPanel}</a-entity>`;

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
                <a-entity id="rig" ${position.tag}>
                    <a-camera ${className} id="${props.id}" ${cursorCameraControls} position="0 1.6 0">
                    ${cursor}
                    </a-camera>
                    ${touchContollers}
                </a-entity>
                `;

                  console.log(position.tag);

                break;
              case "light":
                innerMarkup = `${innerMarkup}
                  <a-light ${className} type="${
                  props.type ? props.type : "point"
                }" ${color.tag} ${position.tag}>
                  </a-light>`;
                break;
              case "audio":
                assetsElements.push(
                  `<audio id="${
                    props.id
                  }" ${className} preload="auto" crossorigin="anonymous" src="${
                    props.src
                  }" ${position.tag}></audio>`
                );
                break;
              case "image":
                assetsElements.push(
                  `<img ${className} id="${props.id}" src="${
                    props.art
                  }" crossorigin="anonymous" preload="true" />`
                );
                // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
                innerMarkup = `${innerMarkup}
                  <a-image ${className} src="#${
                  props.id
                }" material="alphaTest: 0.5" ${position.tag} ${scale.tag} ${
                  rotation.tag
                }>
                  </a-image>`;
                break;
              case "imagecube":
                let cube = this.getCube(props);
                cube.map((face, index) => {
                  assetsElements.push(
                    `<img ${className} id="${props.id}-${index}" src="${
                      face.art
                    }" crossorigin="anonymous" preload="true" />`
                  );

                  innerMarkup = `${innerMarkup}
                    <a-image ${className} src="#${props.id}-${index}" ${
                    face.position
                  } ${scale.tag} ${face.rotation}></a-image>`;
                });
                break;
              case "text":
                innerMarkup = `${innerMarkup}
                  <a-entity ${text.tag} ${position.tag} ${
                  scale.tag
                }></a-entity>`;
                break;
              case "box":
                if (props.type !== undefined && props.type === "button") {
                  innerMarkup = `${innerMarkup}
                    <a-box
                      ${className}
                      ${color.tag}
                      data-clickable
                      cursor-listener
                      visible="true"
                      id="${props.id}"
                      ${position.tag}
                      ${rotation.tag}
                      ${dimensions.tag}
                      event-set__click="${props.click}"
                      event-set__mouseenter="${props.mouseenter}"
                      event-set__mouseleave="${props.mouseleave}"
                      sound="${props.sound}"
                    >
                    </a-box>`;
                } else {
                  innerMarkup = `${innerMarkup}
                  <a-box
                    ${className}
                    ${color.tag}
                    ${position.tag}
                    ${rotation.tag}
                    ${dimensions.tag}
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

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
    if (
      data !== undefined &&
      data[label] !== undefined
    ) {

      let props = data[label];
      let options = ``;
      Object.keys(props).map(prop => {
        options = `${options}${prop}=${props[prop]};`
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
        tag: `width="${data[label].width}" height="${data[label].height}" depth="${data[label].depth}"`,
        attributes: `${data[label].width} ${data[label].height} ${data[label].depth}`
      };
    }
    return ``;
  }

  getCube(data) {
    let cube = [
      {
        position: `position="${data.position.x} ${data.position.y} ${data.position.z - (data.scale.z / 2)}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.back : data.art,
      },
      {
        position: `position="${data.position.x} ${data.position.y} ${data.position.z + (data.scale.z / 2)}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.front : data.art,
      },
      {
        position: `position="${data.position.x} ${data.position.y - (data.scale.y / 2)} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x - 90} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.bottom : data.art,
      },
      {
        position: `position="${data.position.x} ${data.position.y + (data.scale.y / 2)} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x + 90} ${data.rotation.y} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.top : data.art,
      },
      {
        position: `position="${data.position.x  - (data.scale.x / 2)} ${data.position.y} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y - 90} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.left : data.art,
      },
      {
        position: `position="${data.position.x + (data.scale.x / 2)} ${data.position.y} ${data.position.z}"`,
        rotation: `rotation="${data.rotation.x} ${data.rotation.y + 90} ${data.rotation.z}"`,
        art: typeof data.art === "object" ? data.art.right : data.art,
      },
    ];
    return cube;
  }

  playGLTFAnimation(e) {
    console.log(e, 'playing');
  }

  // Format json object as a-frame
  render(json) {
    let innerMarkup = ``;
    let assetsElements = [];

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
            let line = this.getProperties('line', props);
            switch (propKey) {
              case "sky":
                if (props.color !== undefined) {
                  innerMarkup = `${innerMarkup}<a-sky color="${color.attribute}"></a-sky>`;
                } else if (
                  props.color === undefined &&
                  props.art !== undefined &&
                  props.id !== undefined
                ) {
                  assetsElements.push(
                    `<img ${className} id="${props.id}" src="${props.art}" crossorigin="anonymous" preload="true" />`
                  );

                  // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
                  innerMarkup = `${innerMarkup}
                    <a-sky ${className} src="#${props.id}" ${color.attribute} animation="property: rotation; to: ${rotation.attributes}; dur: 10" preload="auto"
                    animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
                    animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade">
                    </a-sky>`;
                }
                break;
              case "mesh":
                if (props.art !== undefined) {
                  // https://aframe.io/docs/0.9.0/components/gltf-model.html
                  assetsElements.push(
                    `<a-asset-item ${className} id="${props.id}" src="${props.art}" preload="auto"></a-asset-item>`
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
              let touchContollers = ``;
              if (props.touch !== undefined) {
                // https://aframe.io/docs/0.9.0/introduction/interactions-and-controllers.html
                // Can change hand controller
                let leftModel = ``;
                let rightModel = ``;
                if (props.touch.left.glb !== undefined) {
                  let leftModelScale = this.getAxis("scale", props.touch.left);
                  let leftModelPosition = this.getAxis("position", props.touch.left);
                  // https://aframe.io/docs/0.9.0/components/gltf-model.html
                  // assetsElements.push(
                  //   `<a-asset-item id="${props.touch.left.id}" src="${props.touch.left.glb}" preload="auto"></a-asset-item>`
                  // );

                  leftModel  = `
                    <a-entity
                    ${className}
                    gltf-model="${props.touch.left.glb}"
                    ${leftModelScale.tag}
                    ${leftModelPosition.tag}
                    crossorigin="anonymous"
                    preload="true"
                    >
                    </a-entity>`;
                }


                if (props.touch.right !== undefined && props.touch.right.glb !== undefined) {
                  let rightModelScale = this.getAxis("scale", props.touch.right);
                  let rightModelPosition = this.getAxis("position", props.touch.right);
                  // https://aframe.io/docs/0.9.0/components/gltf-model.html
                  assetsElements.push(
                    `<a-asset-item id="${props.touch.right.id}" src="${props.touch.right.glb}" preload="auto"></a-asset-item>`
                  );

                  rightModel  = `
                    <a-entity
                    ${className}
                    gltf-model="#${props.touch.right.id}"
                    ${rightModelScale.tag}
                    ${rightModelPosition.tag}
                    crossorigin="anonymous"
                    preload="true"
                    >
                    </a-entity>`;
                }

                touchContollers = `
                <a-entity id="leftHand" oculus-touch-controls="hand:left">${leftModel}</a-entity>
                <a-entity id="rightHand" oculus-touch-controls="hand:right">${rightModel}</a-entity>`;
              }
              if (props.laser !== undefined) {
                // https://aframe.io/docs/0.9.0/introduction/interactions-and-controllers.html
                // Can change hand controller
                let leftLine = this.getProperties('line', props.left);
                let rightLine = this.getProperties('line', props.right);
                innerMarkup = `${innerMarkup}
                <a-entity laser-controls="hand: left" ${leftLine}></a-entity>
                <a-entity laser-controls="hand: right" ${rightLine}></a-entity>`;
              }


                let fadeMask = ``;
                if (props.fadeMask === true) {
                  // fadeMask = `
                  //   <a-entity id="fade-mask" geometry="primitive: box" scale="200 200 200" color="#000000" material="opacity: 1">
                  //     <a-animation attribute="material.opacity" begin="fade" to="1"></a-animation>
                  //   </a-entity>`;

                    fadeMask = `
                      <a-box scale="200 200 200" position="0 0 -10" color="#000000">

                      </a-box>`;
                }
                if (props.cursorCamera === true) {
                  // Add camera cursor
                  // console.log("Setting up Cursor Camera", props);
                  innerMarkup = `${innerMarkup}
                    <a-entity ${className} id="${props.id}" ${position.tag}>
                      <a-camera ${className} id="${props.id}" look-controls wasd-controls>
                      <a-entity
                        cursor="fuse: true"
                        material="color: black; shader: flat"
                        position="0 0 -3"
                        raycaster="objects: .clickable; showLine: true;"
                        geometry="primitive: ring; radiusInner: 0.08; radiusOuter: 0.1;"
                        line="color: green; opacity: 0.5"
                        >
                      </a-entity>
                      ${fadeMask}
                      ${touchContollers}
                      </a-camera>
                    </a-entity>`;
                } else {
                  innerMarkup = `${innerMarkup}
                    <a-entity ${className} id="${props.id}" ${position.tag}>
                      <a-camera ${className} id="${props.id}">
                      ${fadeMask}
                      ${touchContollers}
                      orientationOffset="-0.1 -0.1 -0.1"
                      </a-camera>
                    </a-entity>`;
                }



                break;
              case "light":
                innerMarkup = `${innerMarkup}
                  <a-light ${className} type="${props.type ? props.type : 'point'}" ${color.tag} ${position.tag}>
                  </a-light>`;
                break;
              case 'audio':
                assetsElements.push(`<audio id="${props.id}" ${className} preload="auto" crossorigin="anonymous" src="${props.src}" ${position.tag}></audio>`);
                break;
              case 'image':
                assetsElements.push(
                  `<img ${className} id="${props.id}" src="${props.art}" crossorigin="anonymous" preload="true" />`
                );
                // HACK force a quick rotation to easily fix any weirdly oriented skybox art.
                innerMarkup = `${innerMarkup}
                  <a-image ${className} src="#${props.id}" material="alphaTest: 0.5" ${position.tag} ${scale.tag} ${rotation.tag}>
                  </a-image>`;
                  break;
              case 'imagecube':
                let cube = this.getCube(props);
                cube.map((face, index) => {
                  assetsElements.push(
                    `<img ${className} id="${props.id}-${index}" src="${face.art}" crossorigin="anonymous" preload="true" />`
                  );

                  innerMarkup = `${innerMarkup}
                    <a-image ${className} src="#${props.id}-${index}" ${face.position} ${scale.tag} ${face.rotation}></a-image>`;
                });
                break;
              case 'text':
                innerMarkup = `${innerMarkup}
                  <a-entity ${text.tag} ${position.tag} ${scale.tag}></a-entity>`;
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
                      event-set__click="color: yellow"
                      event-set__mouseenter="scale: 1.2 1.2 1.2; color: green"
                      event-set__mouseleave="scale: 1 1 1; color: red"
                      sound="on: click; src: #click-sound"
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
      };
    }
  }
}

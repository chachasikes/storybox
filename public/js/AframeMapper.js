

export class AframeMapper {
  constructor() {
    this.getDimensions = this.getDimensions.bind(this);
  }

  getDimensions(label, data) {
    if (data !== undefined &&
        data[label] !== undefined &&
        data[label].x !== undefined &&
        data[label].y !== undefined &&
        data[label].z !== undefined ) {
        return {
          tag: `${label}="${data[label].x} ${data[label].y} ${data[label].z}"`,
          attributes: `${data[label].x} ${data[label].y} ${data[label].z}`,
        }
    }
    return ``;
  }

  render(json) {
    let innerMarkup = ``;
    if (json !== undefined) {
      Object.keys(json).map((item) => {
        if (Object.keys(json[item]).length > 0) {
            Object.keys(json[item]).map((propkey) => {
              let props = json[item][propkey];
              let scale = this.getDimensions('scale', props);
              let rotation = this.getDimensions('rotation', props);
              let position = this.getDimensions('position', props);
              switch(propkey) {
                case 'sky':
                  if (props.color !== undefined) {
                    console.log(innerMarkup);
                    innerMarkup = `${innerMarkup}<a-sky color="${props.color}"></a-sky>`;
                  } else if (props.color === undefined && props.art !== undefined && props.id !== undefined) {
                    innerMarkup = `${innerMarkup}
                    <a-assets>
                      <img id="${props.id}" src="${props.art}" crossorigin="anonymous" />
                    </a-assets>
                    <a-sky src="${props.art}" animation="property: rotation; to: ${rotation.attributes};">
                    </a-sky>`;
                  }
                  break;
                case 'mesh':
                  if (props.art !== undefined) {
                    innerMarkup = `${innerMarkup}
                    <a-entity gltf-model="url(${props.art})" ${scale.tag} crossorigin="anonymous">
                    </a-entity>`;
                  }
                  break;
                case 'camera':
                  innerMarkup = `${innerMarkup}
                  <a-entity id="${props.id}" ${position.tag}>
                    <a-camera id="${props.id}"></a-camera>
                  </a-entity>`;
                  break;
              }
            });

        }
      });

      return `<a-scene>
      ${innerMarkup}
      </a-scene>`;
    }
  }
}

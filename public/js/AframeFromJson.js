export class AframeFromJson {
  constructor() {
    this.getDimensions = this.getDimensions.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue(label, data) {
    if (data !== undefined &&
        data[label] !== undefined) {
      return {
        tag: `${label}="${data[label]}"`,
        attribute: `${data[label]}`,
      }
    }
    return {
      tag: ``,
      attribute: ``,
    };
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
              let offset = this.getDimensions('offset', props);
              let color = this.getValue('color', props);
              switch(propkey) {
                case 'sky':
                  if (props.color !== undefined) {
                    innerMarkup = `${innerMarkup}<a-sky color="${color.attribute}"></a-sky>`;
                  } else if (props.color === undefined && props.art !== undefined && props.id !== undefined) {
                    innerMarkup = `${innerMarkup}
                    <a-scene>
                    <a-assets>
                      <img id="${props.id}" src="${props.art}" crossorigin="anonymous" />
                    </a-assets>
                    <a-sky src="${props.art}" animation="property: rotation; to: ${rotation.attributes}; dur: 10"
                    animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
                    animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade">
                    </a-sky></a-scene>`;
                  }
                  break;
                case 'mesh':
                  if (props.art !== undefined) {
                    innerMarkup = `${innerMarkup}
                    <a-entity gltf-model="url(${props.art})" ${scale.tag} ${position.tag} crossorigin="anonymous">
                    </a-entity>`;
                  }
                  break;
                case 'camera':
                console.log('com', props, position);
                  innerMarkup = `${innerMarkup}
                  <a-entity id="${props.id}" ${position.tag}>
                    <a-camera id="${props.id}"></a-camera>
                  </a-entity>`;
                  break;
                case 'light':
                  innerMarkup = `${innerMarkup}
                  <a-light type="point" ${color.tag} ${position.tag}>
                  </a-light>`;
                  break;

              }
              innerMarkup = `${innerMarkup}`;
            });

        }
      });

      return `${innerMarkup}`;
    }
  }
}


//     <div>Current Scene: ${this.currentScene}</div>
//     <div>Total Duration: ${this.totalDuration}</div>
//     <button onClick="window.StoryBoxBuilder.firstScene()">First Scene</button>
//     <button onClick="window.StoryBoxBuilder.previousScene()">Back</button>
//     <button onClick="window.StoryBoxBuilder.nextScene()">Next</button>
//     <button onClick="window.StoryBoxBuilder.lastScene()">Last Scene</button>
//     <button onClick="window.StoryBoxBuilder.play()">Play</button>
//     <button onClick="window.StoryBoxBuilder.replayScene()">Replay Scene</button>
//     <button onClick="window.StoryBoxBuilder.pauseScene()">Pause</button>

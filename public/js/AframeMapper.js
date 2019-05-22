

export class AframeMapper {
  constructor() {
  }

  render(json) {
    let innerMarkup = ``;
    if (json !== undefined) {
      Object.keys(json).map((item) => {
        if (Object.keys(json[item]).length > 0) {
            Object.keys(json[item]).map((propkey) => {
              switch(propkey) {
                case 'sky':
                  let props = json[item][propkey];
                  if (props.color !== undefined) {
                    console.log(innerMarkup);
                    innerMarkup = `${innerMarkup}<a-sky color="${props.color}"></a-sky>`;
                  } else if (props.color === undefined && props.art !== undefined && props.id !== undefined) {
                    innerMarkup = `${innerMarkup}<a-assets>
                      <img id="${props.id}" src="${props.art}" crossorigin="anonymous">
                     </a-assets>
                    <a-sky src="#${props.id}"></a-sky>`;
                  }
                  break;
                case 'mesh':
                  let props = json[item][propkey];
                  if (props.art !== undefined) {
                    if (props.scale !== undefined &&
                        props.scale.x !== undefined &&
                        props.scale.y !== undefined &&
                        props.scale.z !== undefined ) {
                        innerMarkup = `${innerMarkup}<a-entity gltf-model="url(${props.art})" scale="${props.scale.x} ${props.scale.y} ${props.scale.z}">`;
                    }
                  }
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

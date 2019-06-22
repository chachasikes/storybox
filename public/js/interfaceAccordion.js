
export function updateAccordionLine(parent) {
  var rig = document.querySelector("#rig");
  var stretchLeft = document.querySelector("#leftStretch");
  var stretchRight = document.querySelector("#rightStretch");
  var leftHand = document.querySelector("#leftHand");
  var rightHand = document.querySelector("#rightHand");
  vrlog('accordion line');
  if (
    (stretchLeft !== null &&
    stretchRight !== null &&
    stretchLeft.object3D !== undefined) ||
    (leftHand !== null &&
    leftHand !== null &&
    leftHand.object3D !== undefined) ||
  ) {
    let positionLeft = stretchLeft.object3D.position;
    let positionRight = stretchRight.object3D.position;
    let positionLeftHand = leftHand.object3D.position;
    let positionRightHand = rightHand.object3D.position;
    let cameraPosition = rig.object3D.position;

    vrlog(positionLeft);

    let newPositionLeft, newPositionRight;

    if (!AFRAME.utils.device.checkHeadsetConnected()) {
      newPositionLeft = parent.testPositions[parent.testPosition].left;
      newPositionRight = parent.testPositions[parent.testPosition].right;
      stretchLeft.setAttribute("position", newPositionLeft);
      stretchRight.setAttribute("position", newPositionRight);
      // console.log(newPositionLeft, newPositionRight);
    } else {
      newPositionLeft = {
        x: positionLeftHand.x,
        y: positionLeftHand.y,
        z: positionLeftHand.z
      };
      newPositionRight = {
        x: positionRightHand.x,
        y: positionRightHand.y,
        z: positionRightHand.z
      };
      vrlog(newPositionLeft);
    }

    var stretch = document.querySelector("#rose-stretch");

    if (stretch !== null) {
      let line = stretch.getAttribute("line");
      let lineParsed = AFRAME.utils.styleParser.parse(line);
      lineParsed.start = newPositionLeft;
      lineParsed.end = newPositionRight;
      stretch.setAttribute("line", lineParsed);
    }

    var stretchObjects = document.querySelectorAll(".stretch-object");
    let positionObj;
    if (stretchObjects !== null && stretchObjects.length > 0) {
      stretchObjects.forEach(obj => {
        let id = obj.getAttribute("id");
        let el = document.getElementById(id);
        positionObj = updateStretchPosition(
          newPositionLeft,
          newPositionRight,
          el,
          cameraPosition
        );
        let propPosition = el.getAttribute("position");
        el.setAttribute("position", positionObj);
      });
    }
  }
}

export function updateStretchPosition(a, b, item, cameraPosition) {
  let percentageX = parseFloat(item.getAttribute("data-percentage-x"));
  let percentageY = parseFloat(item.getAttribute("data-percentage-y"));
  let percentageZ = parseFloat(item.getAttribute("data-percentage-z"));
  let percentage = percentageX; // @TODO connect to stretch axis setting if needed.
  let data = {
    x: ((b.x - a.x) * percentage) + a.x,
    y: ((b.y - a.y) * percentage) + a.y,
    z: ((b.z - a.z) * percentage) + a.z
  };
  let dataChecked = {
    x: data.x !== Infinity ? data.x : 0,
    y: data.y !== Infinity ? data.y : 0 ,
    z: data.z !== Infinity ? data.z : 0
  };
  return dataChecked;
}

export function buildHandPropInterface(
  parent,
  props,
  innerMarkup,
  assetsElements,
  assetItemElements,
  aframeTags
) {
  let rope = ``;
  let objectPositions = ``;
  let leftBox = ``;
  let rightBox = ``;
  let left = {};
  let right = {};

  if (props !== undefined && props.type === "stretch") {
    left = props.a;
    right = props.b;
    if (!AFRAME.utils.device.checkHeadsetConnected()) {
      props.a.position = {
        x: parent.playerArmOffset,
        y: parent.playerHeight,
        z: parent.playerArmOffset
      };
      props.b.position = {
        x: parent.playerArmOffset * -1,
        y: parent.playerHeight,
        z: parent.playerArmOffset
      };

      props.positions.forEach(item => {
        item.position.x = item.position.x - parent.playerArmOffset * -1;
        item.position.y = item.position.y - parent.playerHeight;
        item.position.z = item.position.z - parent.playerArmOffset * -1;
        return item;
      });
    }

    let aTags = parent.buildTags(props.a);
    let bTags = parent.buildTags(props.b);

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

    if (props.positions !== undefined) {
      props.positions.forEach(item => {
        let obj = parent.stretchPosition(
          props.a.position,
          props.b.position,
          item
        );
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
        line="start: ${props.a.position.x}, ${props.a.position.y}, ${
      props.a.position.z
    }; end: ${props.b.position.x}, ${props.b.position.y}, ${
      props.b.position.z
    }; color: ${props.ropeColor}"
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
    objectPositions: objectPositions,
    left,
    right
  };
}

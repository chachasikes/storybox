import { vrlog } from "./utilities/vrlog.js";

export function intersectSceneAccordion(e) {
  // console.log('intersectSceneAccordion', e);
  vrlog('intersected');
  // Test removal of object if intersect
  let testHand = document.getElementById('middleHand');
  testHand.parentNode.removeChild(testHand);

  // Actual behavior:
  /**
  - if intersect = fade in and play target scene, if playable
  - if next level & intersect any & length is short  - play the final scene


  */
}

// @TODO function accordion line length shorter for a min duration & then longer - step through song array until over - (with repeat)

export function updateAccordionLine() {
  var rig = document.querySelector("#rig");
  var stretchLeft = document.querySelector("#leftStretch");
  var stretchRight = document.querySelector("#rightStretch");
  var leftHand = document.querySelector("#leftHand");
  var rightHand = document.querySelector("#rightHand");

  if (
    (stretchLeft !== null &&
    stretchRight !== null &&
    stretchLeft.object3D !== undefined) ||
    (leftHand !== null &&
    leftHand !== null &&
    leftHand.object3D !== undefined)
  ) {
    let positionLeft = stretchLeft.object3D.position;
    let positionRight = stretchRight.object3D.position;
    let positionLeftHand = leftHand.object3D.position;
    let positionRightHand = rightHand.object3D.position;
    let cameraPosition = rig.object3D.position;
    let newPositionLeft, newPositionRight;
    if (!AFRAME.utils.device.checkHeadsetConnected()) {
      newPositionLeft = window.StoryboxNavigator.testPositions[window.StoryboxNavigator.testPosition].left;
      newPositionRight = window.StoryboxNavigator.testPositions[window.StoryboxNavigator.testPosition].right;
      stretchLeft.setAttribute("position", newPositionLeft);
      stretchRight.setAttribute("position", newPositionRight);
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
    }

    var stretch = document.querySelector("#rose-stretch");
    if (stretch !== null) {
      let line = stretch.getAttribute("line");
      let lineParsed = AFRAME.utils.styleParser.parse(line);
      if (line !== null && lineParsed !== undefined && lineParsed !== null) {
        lineParsed.start = newPositionLeft;
        lineParsed.end = newPositionRight;
        stretch.setAttribute("line", lineParsed);
      }
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
        if (positionObj !== null) {
          let propPosition = el.getAttribute("position");
          el.setAttribute("position", positionObj);
        }
      });
    }
  }
}

export function updateStretchPosition(a, b, item, cameraPosition) {
  if (a !== undefined && b !== undefined) {
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
  return null;
}

export function buildHandPropInterface(
  parent,
  props,
  innerMarkup,
  preloadElements,
  assetItemElements,
  aframeTags
) {
  let rope = ``;
  let objectPositions = ``;
  let leftBox = ``;
  let rightBox = ``;
  let left = {};
  let right = {};
  let className=`class="stretch-object"`;
  // console.log('set up hand props');
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
        let obj = stretchPosition(
          props.a.position,
          props.b.position,
          item
        );
        let intersection = ``;
        if (item.intersect !== undefined) {

          intersection = `
            sphere-intersection="objects: .head" intersect-action="${item.intersectAction}" intersect-target="${item.intersectTarget}"
            `;

          className=`class="stretch-object"`;
        }


        objectPositions = `${objectPositions}
            <a-sphere
            id="${item.id}"
            ${className}
            ${intersection}
            position="${obj.position.x} ${obj.position.y} ${obj.position.z}"
            data-percentage-x="${obj.percentageX}"
            data-percentage-y="${obj.percentageY}"
            data-percentage-z="${obj.percentageZ}"
            radius="${item.radius}"
            color="${item.color}"
            material="shader:flat"
            transparent="true"
            opacity="0.3"
            ></a-sphere>
            `;
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
    preloadElements: preloadElements,
    innerMarkup: innerMarkup,
    rope: rope,
    leftBox: leftBox,
    rightBox: rightBox,
    objectPositions: objectPositions,
    left,
    right
  };
}

export function stretchPosition(a, b, item) {
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

import { vrlog } from "./../utilities/vrlog.js";

export function registerComponent() {
  if (AFRAME.components["accordion-stretch"] === undefined) {
  AFRAME.registerComponent('accordion-stretch', {
    schema: {
      name: {default: 'accordion-element'},
      intersectTarget: {default: null},
      action: {default: null},
    },
    init: function() {
      window.StoryboxNavigator.accordionStretch = {
        direction: 1,
        directionPoll: [],
      };

      this.throttleCheckDirection = AFRAME.utils.throttle(this.calculateDirection, 1000, this);
      updateAccordionLine(this);
    },

    seekAnimationTime: function(animation, percentTime){
      let timeInSeconds = 0;
      let animMixer = animation.mixer;
      // https://stackoverflow.com/questions/53004301/how-to-manually-control-animation-frame-by-frame
      animMixer.time = 0;
      for(var i=0; i < animMixer._actions.length; i++){
        // console.log(animMixer._actions[i]);
        if (animMixer._actions[i]._clip !== undefined && animMixer._actions[i]._clip.duration !== undefined) {
          timeInSeconds = (animMixer._actions[i]._clip.duration * percentTime) / animMixer._actions[i].timeScale;
          // timeInSeconds = 0;
          // console.log(timeInSeconds, animMixer._actions[i]._clip.duration, percentTime);
          animMixer._actions[i].time = timeInSeconds;
                vrlog(timeInSeconds);
          this.pauseCurrentAnimationAction(animation);
        }
      }
    },

    pauseCurrentAnimationAction: function(animation) {
      if (animation.activeActions !== undefined && animation.activeActions[0] !== undefined) {
        animation.activeActions[0].paused = true;
      }
    },

    playCurrentAnimationAction: function(animation) {
      if (animation.activeActions !== undefined && animation.activeActions[0] !== undefined) {
        animation.activeActions[0].paused = false;
      }
    },

    calculateDirection: function() {
      let poll = window.StoryboxNavigator.accordionStretch.directionPoll;
      let direction = window.StoryboxNavigator.accordionStretch.direction;

      let trendMatrix = [];
      let trendChange = [];
      let counter = 0;
      if (poll.length > 1) {
        let last = Math.abs(poll[poll.length - 2].left) + Math.abs(poll[poll.length - 2].right);
        let current = Math.abs(poll[poll.length - 1].left) + Math.abs(poll[poll.length - 1].right);

        let stretchMesh = document.querySelector('[data-animation-type="stretch"]');

        let data = stretchMesh.getAttribute('animation-mixer-storybox');

        if (current > last) {
          window.StoryboxNavigator.accordionStretch.direction = 1;
          data.clip = 'stretch';
          stretchMesh.setAttribute("animation-mixer-storybox", data);

        } else {
          window.StoryboxNavigator.accordionStretch.direction = -1;
          data.clip = 'squash';
          stretchMesh.setAttribute("animation-mixer-storybox", data);
        }

        vrlog(data.clip);

        // let stretchMesh = document.querySelector('[data-animation-type="stretch"]');

        let animation = stretchMesh.components["animation-mixer-storybox"];
        if (animation !== undefined) {
          this.seekAnimationTime(animation, 0.1);
        }
      }
    },

    update: function() {
      // console.log('accordion update', this.el.getAttribute('id'));
      updateAccordionLine(this);
    },
    tick: function () {
      updateAccordionLine(this);
    },
    remove: function() {
    }
  });
}
}

// @TODO function accordion line length shorter for a min duration & then longer - step through song array until over - (with repeat)

export function updateAccordionLine(parent) {
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


    let poll = window.StoryboxNavigator.accordionStretch.directionPoll;
    // Store the direction of movement.
    if (poll.length > 100) {
      poll.shift();
    }
    if (poll.length === 0) {
      poll.push(
        {
          left: positionLeft.x,
          right: positionRight.x
        }
      );
    }

    // Push new values on change
    if (poll[poll.length - 1] !== undefined &&
        (poll[poll.length - 1].left !== positionLeft.x ||
        poll[poll.length - 1].right !== positionRight.x)
        ) {
      poll.push(
        {
          left: positionLeft.x,
          right: positionRight.x
        }
      );
    }

    parent.throttleCheckDirection();

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

    rope = `<a-entity accordion-stretch id="${props.id}"
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

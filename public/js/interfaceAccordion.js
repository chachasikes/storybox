export function updateAccordionLine() {
    var stretchLeft = document.querySelector("#leftStretch");
    var stretchRight = document.querySelector("#rightStretch");
    var leftHand = document.querySelector("#leftHand");
    var rightHand = document.querySelector("#rightHand");
    if (stretchLeft !== null && stretchRight !== null && stretchLeft.object3D !== undefined) {
      let positionLeft = stretchLeft.object3D.position;
      let positionRight = stretchRight.object3D.position;
      let positionLeftHand = leftHand.object3D.position;
      let positionRightHand = rightHand.object3D.position;

      let newPositionLeft, newPositionRight;

      if (!AFRAME.utils.device.checkHeadsetConnected()) {
        newPositionLeft = {
          x: positionLeft.x - 0.01,
          y: positionLeft.y,
          z: positionLeft.z,
        };
        newPositionRight = {
          x: positionRight.x + 0.01,
          y: positionRight.y,
          z: positionRight.z,
        };
        stretchLeft.setAttribute('position', newPositionLeft);
        stretchRight.setAttribute('position', newPositionRight);
      } else {
        newPositionLeft = {
          x: positionLeftHand.x,
          y: positionLeftHand.y,
          z: positionLeftHand.z,
        };
        newPositionRight = {
          x: positionRightHand.x,
          y: positionRightHand.y,
          z: positionRightHand.z,
        };
      }

      var stretch = document.querySelector("#rose-stretch");

      if (stretch !== null) {
        let line = stretch.getAttribute('line');
        let lineParsed = AFRAME.utils.styleParser.parse(line);
        lineParsed.start = newPositionLeft;
        lineParsed.end = newPositionRight;
        stretch.setAttribute('line', lineParsed);
      }

      var stretchObjects = document.querySelectorAll('.stretch-object');
      let positionObj;
      if (stretchObjects !== null && stretchObjects.length > 0) {
        stretchObjects.forEach(obj => {
          let id = obj.getAttribute('id');
          let el = document.getElementById(id);
          positionObj = window.StoryboxAframe.updateStretchPosition(newPositionLeft, newPositionRight, el);
          let newPositionObj = {
            x: positionObj.x !== Infinity ? positionObj.x : 0,
            y: positionObj.y !== Infinity ? positionObj.y - 0.8 : -0.8,
            z: positionObj.z !== Infinity ? positionObj.z - 0.38 : -0.38,
          }
          let propPosition = el.getAttribute('position');
          el.setAttribute('position', newPositionObj);
        });
      }
    }
  }

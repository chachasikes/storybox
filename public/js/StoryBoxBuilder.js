import { storybox } from "./storybox.js";
import { AframeFromJson } from "./AframeFromJson.js";

export class StoryBoxBuilder {
  constructor() {
    this.currentScene = 0;
    this.timeElapsedScene = 0;
    let totalDuration = 0;
    storybox.forEach(scene => {
      totalDuration = totalDuration + Number(scene.duration);
      return;
    });
    this.totalTimeElapsed = 0;
    this.totalDuration = totalDuration;
    this.numberScenes = storybox.length;
    this.timer = null;
    this.target = null;
  }

  firstScene() {
    this.currentScene = 0;
    clearTimeout(this.timer);
    console.log("firstScene", this);
    this.update();
  }

  lastScene() {
    this.currentScene = this.numberScenes;
    clearTimeout(this.timer);
    console.log("lastScene", this);
    this.update();
  }

  play() {
    this.currentScene = 0;
    clearTimeout(this.timer);
    this.playScene();
  }

  start() {
    this.currentScene = 0;
    clearTimeout(this.timer);
    this.startStory();
  }

  replayScene() {
    this.playScene();
  }

  startStory() {
    console.log("startStory", this);
    let aframeContent = new AframeFromJson();
    storybox.map(scene => {
      let story = aframeContent.render(scene);

      var s = document.createElement("script");
      s.type = "text/html";
      s.id = scene.id;

      document.querySelector("a-scene").append(s);
      if (document.getElementById(`${scene.id}`) !== null) {
        document.getElementById(`${scene.id}`).innerHTML = story;
      }
    });
    this.update();
  }

  playScene() {
    console.log("playScene", this);
    if (storybox[this.currentScene] && storybox[this.currentScene].duration) {
      this.timer = window.setTimeout(
        function() {
          clearTimeout(this.timer);
          this.nextScene();
          this.playScene();
        }.bind(this),
        storybox[this.currentScene].duration
      );
    }
    this.update();
  }

  pauseScene() {
    console.log("pauseScene", this);
    clearTimeout(this.timer);
    this.update();
  }

  stopScene() {
    console.log("stopScene", this);
    clearTimeout(this.timer);
    this.update();
  }

  previousScene() {
    this.currentScene = this.currentScene > 0 ? this.currentScene - 1 : 0;
    console.log("previousScene", this);
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  nextScene() {
    this.currentScene =
      this.currentScene < this.numberScenes
        ? this.currentScene + 1
        : this.numberScenes;
    console.log("nextScene", this);
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  update() {
    this.render(this.target);
  }

  render(target) {
    console.log('rendering');
    this.target = target;
    if (document.getElementById('scenes') !== null) {
      document.getElementById('scenes').setAttribute('template', 'src', `#${storybox[this.currentScene].id}`);
    }
  }
}

// 
// AFRAME.registerComponent('template-looper', {
//   schema: {type: 'array'},
//
//   init: function () {
//     this.maskEl = this.el.sceneEl.querySelector('#mask');
//     this.index = 0;
//   },
//
//   tick: function (time) {
//     // Swap every second.
//     var self = this;
//     if (time - this.time < 2000) { return; }
//     this.time = time;
//
//     // Set template.
//     this.maskEl.emit('fade');
//     setTimeout(function () {
//       self.el.setAttribute('template', 'src', self.data[self.index++]);
//       self.maskEl.emit('fade');
//       if (self.index === self.data.length) { self.index = 0; }
//     }, 200);
//   }
// });

// <a-scene>
//   <a-assets timeout="10000">
//     <img id="waitingonme">
//   </a-assets>
// </a-scene>
//
// document.querySelector('a-assets').addEventListener('loaded', function () {
//   console.log("OK LOADED");
// });

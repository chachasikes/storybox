import { storybox } from './storybox.js';
import { AframeFromJson } from './AframeFromJson.js';

export class StoryBoxBuilder {
  constructor() {
    this.currentScene = 0;
    this.timeElapsedScene = 0;
    let totalDuration = 0;
    storybox.forEach(scene => {
       totalDuration = totalDuration + Number(scene.duration)
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
    console.log('firstScene', this);
    this.update();
  }

  lastScene() {
    this.currentScene = this.numberScenes;
    clearTimeout(this.timer);
    console.log('lastScene', this);
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
    console.log('playScene', this);
    let aframeContent = new AframeFromJson();
    storybox.map(scene => {
      let story = aframeContent.render(scene);
      if (typeof document.querySelector('a-scene').appendChild === 'object') {
        document.querySelector('a-scene').appendChild(`<script id="${scene.id}" type="text/html">${story}</script>`);
      }
    });
    this.update();
  }

  playScene() {
    console.log('playScene', this);
    if (storybox[this.currentScene] && storybox[this.currentScene].duration) {
      this.timer = window.setTimeout(function(){
        clearTimeout(this.timer);
        this.nextScene();
        this.playScene();
      }.bind(this), storybox[this.currentScene].duration);
    }
    this.update();
  }

  pauseScene() {
    console.log('pauseScene', this);
    clearTimeout(this.timer);
    this.update();
  }

  stopScene() {
    console.log('stopScene', this);
    clearTimeout(this.timer);
    this.update();
  }

  previousScene() {
    this.currentScene = this.currentScene > 0 ? this.currentScene - 1 : 0;
    console.log('previousScene', this);
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  nextScene() {
    this.currentScene = this.currentScene < this.numberScenes ? this.currentScene + 1 : this.numberScenes;
    console.log('nextScene', this);
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  update() {
    this.render(this.target);
  }

  render(target) {
    this.target = target;
    // document.querySelector('#control').setAttribute('template', `src: #${storybox[this.currentScene].id}`)
  }
}



  // <a-scene>
  //   <a-assets timeout="10000">
  //     <img id="waitingonme">
  //   </a-assets>
  // </a-scene>
  //
  // document.querySelector('a-assets').addEventListener('loaded', function () {
  //   console.log("OK LOADED");
  // });

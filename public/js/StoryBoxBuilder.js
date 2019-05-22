import { storybox } from './storybox.js';
import { AframeMapper } from './AframeMapper.js';

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

  replayScene() {
    this.playScene();
  }

  playScene() {
    console.log('playScene', this);

    // let blox = new Blox({description: storybox[this.currentScene]});
    let aframe = new AframeMapper();
    let story = aframe.render(storybox[this.currentScene]);
    document.getElementById('scene').innerHTML = story;
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
    let div = document.body.querySelector(this.target);

    div.innerHTML = (`
      <div class="buttons">
        <div>Current Scene: ${this.currentScene}</div>
        <div>Total Duration: ${this.totalDuration}</div>
        <button onClick="window.StoryBoxBuilder.firstScene()">First Scene</button>
        <button onClick="window.StoryBoxBuilder.previousScene()">Back</button>
        <button onClick="window.StoryBoxBuilder.nextScene()">Next</button>
        <button onClick="window.StoryBoxBuilder.lastScene()">Last Scene</button>
        <button onClick="window.StoryBoxBuilder.play()">Play</button>
        <button onClick="window.StoryBoxBuilder.replayScene()">Replay Scene</button>
        <button onClick="window.StoryBoxBuilder.pauseScene()">Pause</button>
      </div>
      `
    );

  }
}

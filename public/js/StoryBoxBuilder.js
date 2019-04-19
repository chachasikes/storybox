import { Blox } from './../lib/blox/Blox.js';
import { storybox } from './storybox.js';

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
    this.numberScenes = storybox.length

  }

  firstScene() {
    this.currentScene = 0;
    console.log('firstScene', this);
  }

  lastScene() {

    this.currentScene = this.numberScenes;
    console.log('lastScene', this);
  }

  playScene() {
    console.log('playScene', this);
  }

  pauseScene() {
    console.log('pauseScene', this);
  }

  previousScene() {

    this.currentScene = this.currentScene > 0 ? this.currentScene - 1 : 0;
    console.log('previousScene', this);
  }

  nextScene() {

    this.currentScene = this.currentScene < this.numberScenes ? this.currentScene + 1 : this.numberScenes;
    console.log('nextScene', this);
  }


  render() {
    storybox.forEach(scene => {
      if (scene.duration) {
        window.setTimeout(function(){

        }, scene.duration);
      }


      // let blox = new Blox(scene);
      // if(blox) document.body.removeChild(blox.renderer.domElement) // HACK
      // console.log(scene);
    });

    return (`
      <div class="buttons">
        <div>Current Scene: ${this.currentScene}</div>
        <div>Total Duration: ${this.totalDuration}</div>
        <button onClick="window.StoryBoxBuilder.firstScene()">First Scene</button>
        <button onClick="window.StoryBoxBuilder.previousScene()">Back</button>
        <button onClick="window.StoryBoxBuilder.nextScene()"">Next</button>
        <button onClick="window.StoryBoxBuilder.lastScene()">Last Scene</button>
        <button onClick="window.StoryBoxBuilder.playScene()">Play</button>
        <button onClick="window.StoryBoxBuilder.pauseScene()">Pause</button>
      </div>
      `
    );
  }
}

import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
    this.render()
  }
  render() {
    let story = new StoryBoxBuilder();
    window.StoryBoxBuilder = story;
    let target = document.body.querySelector('#app')
    target.innerHTML = story.render();
    return story.render();
  }
}

import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
  }
  init(target) {
    let story = new StoryBoxBuilder(target);
    window.StoryBoxBuilder = story;
    story.render(target);
  }
}

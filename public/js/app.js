import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
  }

  init(target) {
    window.StoryBoxBuilder = new StoryBoxBuilder(target);
    let rendered = window.StoryBoxBuilder.render(target);
  }
}

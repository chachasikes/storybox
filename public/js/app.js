import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
  }
  
  init(target) {
    let story = new StoryBoxBuilder(target);
    window.StoryBoxBuilder = story;
    let rendered = story.render(target);
    let setup = window.StoryBoxBuilder.setupGallery();
  }
}

import { storybox } from './storybox.js';
import { StoryBoxBuilder } from './StoryBoxBuilder.js';

export class App {
  constructor() {
    this.render()
  }
  render() {
    let story = new StoryBoxBuilder(storybox);
    return story.render();
  }
}

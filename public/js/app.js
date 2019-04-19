import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
    this.render()
  }
  render() {
    let story = new StoryBoxBuilder();
    return story.render();
  }
}

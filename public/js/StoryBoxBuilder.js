import { Blox } from './../lib/blox/Blox.js';
import { storybox } from './storybox.js';

export class StoryBoxBuilder {
  render() {
    storybox.forEach(scene => {
      let blox = new Blox(scene);
      console.log(scene);
    });




    return (
      `<div>StoryBox2</div>`
    );
  }
}

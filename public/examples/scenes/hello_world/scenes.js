import { Scene as start } from './start.js';
import { Scene as s1 } from './scene-01.js';
import { Scene as s2 } from './scene-02.js';

export let story = {
  id: 'hello_world',
  name: 'Hello World',
  panel: './examples/scenes/hello_world/images/puppy.png',
  scenes: [
    // start,
    s1,
    // s2
  ]
};

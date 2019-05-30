import { Scene as start } from './start.js';
import { Scene as s1 } from './scene-01.js';
import { Scene as s2 } from './scene-02.js';

export let story = {
  id: 'hello-world',
  name: 'Hello World',
  panel: './images/puppy.png',
  scenes: [
    start,
    s1,
    s2
  ]
};

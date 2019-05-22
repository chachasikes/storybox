import { Scene as s1 } from './scene-01.js';
import { Scene as s2 } from './scene-02.js';
import { Scene as transition } from './transition.js';

let story = [
  transition,
  s1,
  transition,
  s2,
  transition
];

function numberScenes(story) {
  let count = 0;
  story = story.map(item => {
    item.scene = count++;
    return item;
  });
  console.log(story);
  return story;
}

export let storybox = numberScenes(story);

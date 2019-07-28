import { StoryBoxBuilder } from './StoryBoxBuilder.js';
import { StoryboxAframe } from "./StoryboxAframe.js";
import { updateAccordionLine } from "./interfaceAccordion.js";
import { formatDropboxRawLinks } from "./utilities.js";
import { registry } from "./../examples/gallery/registry.js";
import { Scene as gallerySceneJson } from "./../examples/gallery/gallery.js";
// @TODO Dropbox registry or registry via input + URL.
let dropboxScenes = ["https://www.dropbox.com/s/jvtzvpv02h9vecz/dropbox-tincture-sea.json?dl=0"];

export class App {
  constructor() {
    this.registryLocal = registry;
    this.dropboxRegistry = this.loadDropbox(dropboxScenes);
    this.gallerySceneJson = gallerySceneJson;
  }

  init(target) {
    window.StoryBoxBuilder = new StoryBoxBuilder(target);
    window.StoryboxAframe = new StoryboxAframe();
    window.StoryBoxBuilder.updateAccordionLine = updateAccordionLine;
    let rendered = window.StoryBoxBuilder.render(target);
    window.StoryBoxBuilder.init(this);
  }

  loadDropbox(files) {
    let dropboxRegistry = files.forEach(file => {
      let rawFilePath = formatDropboxRawLinks(file);
      let filesData = fetch(rawFilePath)
        .then(response => response.json())
        .then(data => {
          this.registry = this.registryLocal;
          this.registry.push(data);

          // Update registry of stories with additional metadata.
          this.registry.map(story => {
            let count = 0;
            let totalDuration = 0;
            let scenes = story.scenes.map(scene => {
              scene.scene = count++;
              totalDuration = totalDuration + Number(scene.duration);
              return scene;
            });
            story.currentScene = 0;
            story.timeElapsedScene = 0;
            story.totalDuration = totalDuration;
            story.numberScenes = story.scenes.length;
          });
          // Remote data loaded asynchronously - continue.
          this.init();
        });
    });
  }
}

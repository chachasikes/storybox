import { StoryBoxBuilder } from "./StoryBoxBuilder.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import {
  updateAccordionLine,
  intersectSceneAccordion
} from "./interfaceAccordion.js";
import { formatDropboxRawLinks } from "./utilities.js";
import { registry } from "./../examples/gallery/registry.js";
import { Scene as gallerySceneJson } from "./../examples/gallery/gallery.js";
let dropboxScenes = [
  "https://dl.dropboxusercontent.com/s/d5f678nqnqnp1kv/dropbox-tincture-sea.json",
  "https://dl.dropboxusercontent.com/s/nrsmcsbd5cdhm77/scent_ink_unicorn.json"
];

export class App {
  constructor() {
    this.registryLocal = registry;
    this.loadDropbox(dropboxScenes);
    this.gallerySceneJson = gallerySceneJson;
  }

  init(target) {
    window.StoryBoxBuilder = new StoryBoxBuilder(target);
    window.StoryboxAframe = new StoryboxAframe();
    window.StoryBoxBuilder.updateAccordionLine = updateAccordionLine; // @TODO Made an add on component
    window.StoryBoxBuilder.intersectSceneAccordion = intersectSceneAccordion; // @TODO  Made an add on component // abstract out after getting it to work.
    let rendered = window.StoryBoxBuilder.render(target);
    window.StoryBoxBuilder.init(this);
  }

  loadDropbox(files) {
    let fetchPromises = [];
    files.forEach(file => {
      let rawFilePath = formatDropboxRawLinks(file);

      fetchPromises.push(
        new Promise(
          function(resolve, reject) {
            try {
              console.log("trying", rawFilePath);
              fetch(rawFilePath)
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
                  resolve();
                })
                .catch(error => {
                  console.error(error);
                  reject();
                });
            } catch (error) {
              console.error(error);
              reject();
            }
          }.bind(this)
        )
      );
    });

    Promise.all(fetchPromises).then(
      function(values) {
        console.log("Everything loaded. Initializing Storybox");
        // After all remote json files are loaded asynchronously, initialize the app
        this.init();
      }.bind(this)
    );
  }
}

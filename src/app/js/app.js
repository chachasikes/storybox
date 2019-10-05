import { StoryBoxNavigator } from "./StoryBoxNavigator.js";
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

/**
 * Storybox App - provide navigation interface, loaders and JSON interpreters to
 * display and navigate AFrame scenes in WebXR.
 */
export class App {
  constructor() {
    // Build the list of stories to add to the gallery.
    this.registryLocal = registry;
    this.loadDropbox(dropboxScenes);
    this.gallerySceneJson = gallerySceneJson;
  }

  /**
   * Set up (or reset) Storybox scenes
   * @constructor
   * @param {string} target - id of the scene (if undefined, will load gallery)
   */
  init(target) {
    window.StoryBoxNavigator = new StoryBoxNavigator(target);
    window.StoryboxAframe = new StoryboxAframe();
    window.StoryBoxNavigator.updateAccordionLine = updateAccordionLine; // @TODO Made an add on component
    window.StoryBoxNavigator.intersectSceneAccordion = intersectSceneAccordion; // @TODO  Made an add on component // abstract out after getting it to work.
    let rendered = window.StoryBoxNavigator.render(target);
    window.StoryBoxNavigator.init(this);
  }

  /**
   * Set up (or reset) Storybox scenes
   * @constructor
   * @param {array} files - List of public urls to JSON scene description documents.
   */
  loadDropbox(files) {
    let fetchPromises = [];
    files.forEach(file => {
      let rawFilePath = formatDropboxRawLinks(file);

      fetchPromises.push(
        new Promise(
          function(resolve, reject) {
            try {
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

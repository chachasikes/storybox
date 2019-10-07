import { StoryBoxBuilder } from './StoryBoxBuilder.js';
import { StoryboxAframe } from "./StoryboxAframe.js";
import { formatDropboxRawLinks } from "./utilities/dropbox-format.js";
import { registry } from "./../examples/gallery/registry.js";
import { Scene as galleryScene } from "./../examples/gallery/gallery.js";
let registryRemoteScenes = ["https://www.dropbox.com/s/d5f678nqnqnp1kv/dropbox-tincture-sea.json", "https://www.dropbox.com/s/nrsmcsbd5cdhm77/scent_ink_unicorn.json?dl=0"];

/**
 * Build Storybox App
 * @module App
 */
export class App {
  constructor() {
    this.registryLocal = registry;
    this.registryRemote = this.loadExternalJSON(registryRemoteScenes);
    this.galleryScene = galleryScene;
  }

  /**
   * Set up modules and initialize to render gallery or target content.
   */
  init(target) {
    window.StoryBoxBuilder = new StoryBoxBuilder(target);
    window.StoryboxAframe = new StoryboxAframe();
    let rendered = window.StoryBoxBuilder.render(target);
    window.StoryBoxBuilder.init(this);
  }

  /**
   * Look for ID tags and prefix with unique has to ensure no conflicts exist with hidden assets.
   * @param {object} scene - The data for the current scene
   * @param {object} data - Formatted scene.
   */
  formatUniqueProperties(scene) {
    let scene = scene.id;
    let sceneNumber = scene.scene;
    // Iterate over scene object.
    // Recursively read through looking for ID.
    // Console log for elements that were not unique.
    return scene;
  }

  /**
   * Given a hard-coded array of URLS to JSON files, add the scenes to the list of gallery items.
   * @param {array} files - Array of URLS to valid JSON files.
   */
  loadExternalJSON(files) {
    // @TODO Get promise code from intersection branch and try to make it work here.
    let registryRemote = files.forEach(file => {
      let remoteFilePath = formatDropboxRawLinks(file);
      try {
        let filesData = fetch(remoteFilePath)
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
                scene = formatUniqueProperties(scene);
                return scene;
              });
              story.currentScene = 0;
              story.timeElapsedScene = 0;
              story.totalDuration = totalDuration;
              story.numberScenes = story.scenes.length;
            });
            // Remote data loaded asynchronously - continue.
            this.init();
          })
        .catch(error => console.error(error));
      } catch(error) {
        console.error(error);
      }
    });
  }
}

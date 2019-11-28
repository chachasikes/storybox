import { StoryboxNavigator } from "./StoryboxNavigator.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import { formatDropboxRawLinks } from "./utilities/dropbox-format.js";
import { registry } from "./../examples/gallery/registry.js";
import { Scene as galleryScene } from "./../examples/gallery/gallery.js";
let registryRemoteScenes = [
  "https://www.dropbox.com/s/d5f678nqnqnp1kv/dropbox-tincture-sea.json",
  "https://www.dropbox.com/s/nrsmcsbd5cdhm77/scent_ink_unicorn.json?dl=0",
  "https://www.dropbox.com/s/rlbz9gqcuykb2gu/sarah.json?dl=0",
  "https://www.dropbox.com/s/tcl0dxxz9rqzfe2/itchy.json?dl=0"
];

/**
 * Build Storybox App
 * @module App
 */
export class App {
  constructor() {
    this.registryLocal = registry;
    this.registryRemote = this.loadExternalJSON(registryRemoteScenes);
    this.galleryScene = galleryScene;
    this.registry = [];
  }

  load(target) {
    if (document.querySelector("scene-selector") === null) {
      window.StoryboxNavigator = new StoryboxNavigator(target);
      window.StoryboxAframe = new StoryboxAframe();
      let rendered = window.StoryboxNavigator.setTarget(target);
    }
  }

  /**
   * Set up modules and initialize to render gallery or target content.
   */
  init() {
    if (document.querySelector("scene-selector") === null) {
      window.StoryboxNavigator.init(this);
    }
  }

  /**
   * Look for ID tags and prefix with unique has to ensure no conflicts exist with hidden assets.
   * @param {object} scene - The data for the current scene
   * @param {object} data - Formatted scene.
   */
  formatUniqueProperties(scene) {
    // Iterate over scene object.
    // Recursively read through looking for ID.
    // Console log for elements that were not unique.
    return scene;
  }

  /**
   * Check if scene description is valid JSON.
   * @param {string} str - Response as text string.
   */
  isValidJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Given a hard-coded array of URLS to JSON files, add the scenes to the list of gallery items.
   * @param {array} files - Array of URLS to valid JSON files.
   */
  loadExternalJSON(files) {
    try {
      let counter = 0;
      // @TODO Get promise code from intersection branch and try to make it work here.
      let registryRemote = files.forEach(file => {
        let remoteFilePath = formatDropboxRawLinks(file);
        // console.log(remoteFilePath);
        try {
          let filesData = fetch(remoteFilePath)
            .then(response => response.text())
            .then(text => {
              let valid = this.isValidJson(text);
              if (valid === true) {
                let data = JSON.parse(text);

                this.registry = this.registryLocal;
                this.registry.push(data);

                // Update registry of stories with additional metadata.
                this.registry.map(story => {
                  let count = 0;
                  let totalDuration = 0;
                  if (story.scenes.length > 0) {
                    let scenes = story.scenes.map(scene => {
                      scene.scene = count++;
                      scene.duration = scene.duration ? scene.duration : 1000;
                      totalDuration = totalDuration + Number(scene.duration);
                      // scene = this.formatUniqueProperties(scene);
                      return scene;
                    });
                    story.currentScene = 0;
                    story.timeElapsedScene = 0;
                    story.totalDuration = totalDuration;
                    story.numberScenes = story.scenes.length;
                  }
                });
                // Remote data loaded asynchronously - continue.


                counter = counter + 1;
                if (counter === files.length) {
                  // Just initialize after last item completed loading.
                  this.init();
                }
              } else {
                console.log("not valid", remoteFilePath);
                counter = counter + 1;
              }
            })
            .catch(error => {
              console.error(error);
            });
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

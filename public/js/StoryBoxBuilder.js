import { registry } from "./../examples/registry.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import { Gallery } from "./gallery.js";

export class StoryBoxBuilder {
  constructor() {
    console.log("StoryBoxBuilder");
    this.registry = registry;
    this.storySettings = {};
    this.storySettings.currentStory = 'hello-world';
    this.timer = null;
    this.target = null;
    // Load and format stories from story registry.

    this.storySettings.stories = this.registry.map(story => {
      console.log(story);
      let count = 0;
      story = story.scenes.map(item => {
        item.scene = count++;
        return item;
      });
      let totalDuration = 0;
      story.forEach(scene => {
        totalDuration = totalDuration + Number(scene.duration);
        return;
      });
      return {
        currentScene: 0,
        timeElapsedScene: 0,
        totalDuration,
        numberScenes: story.length,
      }
    });
  }

  setupGallery() {
    console.log("setting up gallery", this.storySettings);
    // gallery.render();
    this.galleryItemSelect('hello-world');
  }

  galleryItemSelect(id) {
    this.storySettings.currentStory = id;
    this.timer = null;
    this.target = null;
    this.setupStory();
  }

  getCurrentStory(id) {
    let story = this.registry.filter(item => item.id === id);
    if (story !== undefined && story.length > 0) {
      return story[0];
    }
    return null;
  }

  getCurrentScene(id) {
    let story = this.registry.filter(item => item.id === id);

    if (story !== undefined && story.length > 0) {
      console.log(this.storySettings.stories);
      console.log(story[0]);
      return story[0].currentScene;
    }
    return null;
  }

  setupStory() {
    // console.log("setting up story", this.storySettings);
    clearTimeout(this.timer);
    let storyboxAframe = new StoryboxAframe();
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);

    currentStory.scenes.map(sceneJson => {
      // Get markup chunks for aframe
      let sceneMarkup = storyboxAframe.render(sceneJson);

      // Aggregate assets in loader
      if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
        var assets = document.createElement("a-assets");
        assets.setAttribute("timeout", 60000);
        document.getElementById("scenes").before(assets);
      }

      if (typeof sceneMarkup.assetsElements !== 'string' && sceneMarkup.assetsElements.length > 0) {
        // Load all scene assets
        sceneMarkup.assetsElements.map(asset => {
          document.querySelector("a-assets").innerHTML += asset;
        });
      }
      // Set up dynamically loadable scenes.
      var sceneScript = document.createElement("script");
      sceneScript.type = "text/html";
      sceneScript.id = sceneJson.id;
      document.getElementById("scenes").append(sceneScript);
      // Load scene content into scene
      if (document.getElementById(`${sceneJson.id}`) !== null) {
        document.getElementById(`${sceneJson.id}`).innerHTML = sceneMarkup.innerMarkup;
      }
    });

    this.update();

    document.querySelector("a-assets").addEventListener('loaded', () => {
      this.update();
      console.log(this.storySettings.currentStory);
      let currentScene = this.getCurrentScene(this.storySettings.currentStory);
      if (currentScene && currentScene.autoPlay === true) {
        this.play();
      } else {
        this.pauseScene();
      }
    });
  }

  playScene() {
    let currentScene = this.getCurrentScene(this.storySettings.currentStory);

    if (currentScene && currentScene.duration) {
      this.timer = window.setTimeout(
        function() {
          clearTimeout(this.timer);
          this.nextScene();
          this.playScene();
        }.bind(this),
       currentScene.duration
      );
    }
    this.update();
  }

  pauseScene() {
    clearTimeout(this.timer);
    this.update();
  }

  stopScene() {
    clearTimeout(this.timer);
    this.update();
  }

  previousScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = currentStory.currentScene > 0 ? currentStory.currentScene - 1 : 0;
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  nextScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene =
      currentStory.currentScene < currentStory.numberScenes ?
      currentStory.currentScene + 1 :
      currentStory.numberScenes;
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  firstScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = 0;
    clearTimeout(this.timer);
    // console.log("firstScene", this);
    this.update();
  }

  lastScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = currentStory.numberScenes;
    clearTimeout(this.timer);
    this.update();
  }

  play() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = 0;
    clearTimeout(this.timer);
    this.playScene();
  }

  replayScene() {
    this.playScene();
  }

  updateTemplate(el, id) {
    el.setAttribute("template", `src: #${id}`);
    this.updateEventListeners();
  }

  update() {
    this.render(this.target);
    let currentScene = this.getCurrentScene(this.storySettings.currentStory);
    let sceneSelector;
    if (document.getElementById("scene-selector") === null) {
      // Add main entity for all aFrame content, add to a-scene set in index.html
      let sceneSelectorEl = document.createElement("a-entity");
      sceneSelectorEl.setAttribute("id", "scene-selector");
      document.getElementById("scenes").append(sceneSelectorEl);
    }

    sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '' && currentScene !== undefined) {
      // Set the scene.
      this.updateTemplate(sceneSelector, currentScene.id);
    }
  }

  updateEventListeners() {
    document.querySelector('#scene-selector').addEventListener("click", (e) => {
      switch (e.target.id) {
        case 'play-button':
          this.transition = window.setTimeout(
            function() {
              clearTimeout(this.transition);
              window.StoryBoxBuilder.nextScene();
            }.bind(this),
            2000
          );
          break;
      }
    });
  }

  render(target) {
    this.target = target;
  }
}

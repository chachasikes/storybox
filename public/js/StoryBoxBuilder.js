import { registry } from "./../examples/registry.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import { Gallery } from "./gallery.js";

export class StoryBoxBuilder {
  constructor() {
    this.registry = registry;
    this.storySettings = {};
    this.storySettings.currentStory = 'hello-world';
    this.storySettings.timer = null;
    this.storySettings.target = null;
    this.storySettings.transition = null;

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
  }

  setupGallery() {
    window.Gallery = new Gallery();
    let gallery = window.Gallery.render(this.registry);
    clearTimeout(this.storySettings.timer);

    if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
      var assets = document.createElement("a-assets");
      assets.setAttribute("timeout", 60000);
      document.getElementById("scenes").before(assets);
    }

    if (typeof gallery.assetsElements !== 'string' && gallery.assetsElements.length > 0) {
      // Load all scene assets
      gallery.assetsElements.map(asset => {
        document.querySelector("a-assets").innerHTML += asset;
      });
    }
    // Set up dynamically loadable scenes.
    var sceneScript = document.createElement("script");
    sceneScript.type = "text/html";
    sceneScript.id = "gallery";
    document.getElementById("scenes").append(sceneScript);

    let tiles = `
      <a-camera id="gallery_camera" position="0 10 100" look-controls wasd-controls><a-entity
        cursor="fuse: true"
        material="color: black; shader: flat"
        position="0 0 -3"
        raycaster="objects: .clickable-tile;"
        geometry="primitive: ring; radiusInner: 0.08; radiusOuter: 0.1;"
        line="color: green; opacity: 0.5"
        >
      </a-entity></a-camera>
      <a-light type="point" color="#FFFFFF" position="0 10 100"></a-light>
    `;
    gallery.tiles.forEach(tile => {
      tiles = `${tiles}${tile}`;
    })

    if (document.getElementById(`gallery`) !== null) {
      document.getElementById(`gallery`).innerHTML = tiles;
    }


    document.querySelector("a-assets").addEventListener('loaded', () => {
      let currentScene = "gallery";
      if (currentScene && currentScene.autoPlay === true) {
        this.pauseScene();
      }
    });

    let sceneSelector;
    this.storySettings.currentStory = "gallery";
    if (document.getElementById("scene-selector") === null) {
      // Add main entity for all aFrame content, add to a-scene set in index.html
      let sceneSelectorEl = document.createElement("a-entity");
      sceneSelectorEl.setAttribute("id", "scene-selector");
      document.getElementById("scenes").append(sceneSelectorEl);
    }
    sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '') {
      // Set the scene.
      this.updateTemplate(sceneSelector, "gallery");
    }

    // this.galleryItemSelect('hello-world');
  }

  // Update the selected story
  galleryItemSelect(id) {
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
    this.storySettings.target = null;
    this.setupStory();
  }

  // Load the current story.
  getCurrentStory(id) {
    let story = this.registry.filter(item => item.id === id);
    if (story !== undefined && story.length > 0) {
      return story[0];
    }
    return null;
  }

  // Load data from the current scene
  getCurrentScene(id) {
    let story = this.registry.filter(item => item.id === id);
    if (story !== undefined && story.length > 0) {
      return story[0].scenes[story[0].currentScene];
    }
    return null;
  }

  setupStory() {
    clearTimeout(this.storySettings.timer);
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
      this.storySettings.timer = window.setTimeout(
        function() {
          clearTimeout(this.storySettings.timer);
          this.nextScene();
          this.playScene();
        }.bind(this),
       currentScene.duration
      );
    }
    this.update();
  }

  pauseScene() {
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  stopScene() {
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  previousScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = currentStory.currentScene > 0 ? currentStory.currentScene - 1 : 0;
    this.update();
    clearTimeout(this.storySettings.timer);
    this.playScene();
  }

  nextScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene =
      currentStory.currentScene < currentStory.numberScenes ?
      currentStory.currentScene + 1 :
      currentStory.numberScenes;
    this.update();
    clearTimeout(this.storySettings.timer);
    this.playScene();
  }

  firstScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = 0;
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  lastScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = currentStory.numberScenes;
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  play() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = 0;
    clearTimeout(this.storySettings.timer);
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
    this.render(this.storySettings.target);
    let currentScene = this.getCurrentScene(this.storySettings.currentStory);
    // console.log('currentScene', currentScene);
    let sceneSelector;
    if (document.getElementById("scene-selector") === null) {
      // Add main entity for all aFrame content, add to a-scene set in index.html
      let sceneSelectorEl = document.createElement("a-entity");
      sceneSelectorEl.setAttribute("id", "scene-selector");
      document.getElementById("scenes").append(sceneSelectorEl);
    }

    sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '' && currentScene !== undefined && currentScene !== null) {
      // Set the scene.
      this.updateTemplate(sceneSelector, currentScene.id);
    }
  }

  updateEventListeners() {
    document.querySelector('#scene-selector').addEventListener("click", (e) => {
      console.log('click', e);
      let el = document.getElementById(e.target.id);
      switch (e.target.id) {
        case 'play-button':

          if(el.getAttribute('data-clicked') === null || el.getAttribute('data-clicked') === 'false') {
            el.setAttribute('data-clicked', 'true');
            this.storySettings.transition = window.setTimeout(
              function() {
                clearTimeout(this.storySettings.transition);
                window.StoryBoxBuilder.nextScene();
              }.bind(this),
              2000
            );
          }
          else {
            el.setAttribute('data-clicked', 'false');
          }
        break;
        case 'select-button':
          if(el.getAttribute('data-clicked') === null || el.getAttribute('data-clicked') === 'false') {
            el.setAttribute('data-clicked', 'true');
          }
          else {
            el.setAttribute('data-clicked', 'false');
          }
        break;
      }
    });
  }

  render(target) {
    this.storySettings.target = target;
  }
}

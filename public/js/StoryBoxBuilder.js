import {
  storybox
} from "./storybox.js";
import {
  AframeFromJson
} from "./AframeFromJson.js";

export class StoryBoxBuilder {
  constructor() {
    this.currentScene = 0;
    this.timeElapsedScene = 0;
    let totalDuration = 0;
    storybox.forEach(scene => {
      totalDuration = totalDuration + Number(scene.duration);
      return;
    });
    this.totalTimeElapsed = 0;
    this.totalDuration = totalDuration;
    this.numberScenes = storybox.length;
    this.timer = null;
    this.target = null;
  }

  setup() {
    this.currentScene = 0;
    clearTimeout(this.timer);
    this.setupStory();
  }

  setupStory() {
    let aframeContent = new AframeFromJson();
    storybox.map(sceneJson => {
      // Get markup chunks for aframe
      let scene = aframeContent.render(sceneJson);

      // Aggregate assets in loader
      if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
        var assets = document.createElement("a-assets");
        assets.setAttribute("timeout", 60000);
        document.getElementById("scenes").before(assets);
      }

      if (typeof scene.assetsElements !== 'string' && scene.assetsElements.length > 0) {
        // Load all scene assets
        scene.assetsElements.map(asset => {
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
        document.getElementById(`${sceneJson.id}`).innerHTML = scene.innerMarkup;
      }
    });

    this.update();

    document.querySelector("a-assets").addEventListener('loaded', () => {
      this.update();
      if (storybox[this.currentScene].autoPlay === true) {
        this.play();
      } else {
        this.pauseScene();
      }
    });
  }

  playScene() {
    if (storybox[this.currentScene] && storybox[this.currentScene].duration) {
      this.timer = window.setTimeout(
        function() {
          clearTimeout(this.timer);
          this.nextScene();
          this.playScene();
        }.bind(this),
        storybox[this.currentScene].duration
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
    this.currentScene = this.currentScene > 0 ? this.currentScene - 1 : 0;
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  nextScene() {
    this.currentScene =
      this.currentScene < this.numberScenes ?
      this.currentScene + 1 :
      this.numberScenes;
    this.update();
    clearTimeout(this.timer);
    this.playScene();
  }

  firstScene() {
    this.currentScene = 0;
    clearTimeout(this.timer);
    // console.log("firstScene", this);
    this.update();
  }

  lastScene() {
    this.currentScene = this.numberScenes;
    clearTimeout(this.timer);
    this.update();
  }

  play() {
    this.currentScene = 0;
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
    let sceneSelector;
    if (document.getElementById("scene-selector") === null) {
      // Add main entity for all aFrame content, add to a-scene set in index.html
      let sceneSelectorEl = document.createElement("a-entity");
      sceneSelectorEl.setAttribute("id", "scene-selector");
      document.getElementById("scenes").append(sceneSelectorEl);
    }

    sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '' && storybox[this.currentScene] !== undefined) {
      // Set the scene.
      this.updateTemplate(sceneSelector, storybox[this.currentScene].id);
    }
  }

  updateEventListeners() {
    let currentScene = storybox[this.currentScene].id;
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

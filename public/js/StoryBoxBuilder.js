import { registry } from "./../examples/gallery/registry.js";
import { Scene as gallerySceneJson } from "./../examples/gallery/gallery.js";
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
    this.assetMarkup = ``;
    this.assetMarkupGallery = ``;
    this.showLoading = false;

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
    let storyboxAframe = new StoryboxAframe();
    let buildAssets = true;
    if (this.assetMarkupGallery !== ``) {
      buildAssets = false;
    }

    let gallery = window.Gallery.render(this.registry);
    clearTimeout(this.storySettings.timer);

    if (typeof gallery.assetsElements !== 'string' && gallery.assetsElements.length > 0 && buildAssets === true) {
      // Load all scene assets
      gallery.assetsElements.map(asset => {
        this.assetMarkupGallery += asset;
      });
    }

    // Set up dynamically loadable scenes.
    var sceneScript = document.createElement("script");
    sceneScript.type = "text/html";
    sceneScript.id = "gallery";
    document.getElementById("scenes").append(sceneScript);

    let sceneMarkup = storyboxAframe.render(gallerySceneJson);
    if (typeof sceneMarkup.assetsElements !== 'string' && sceneMarkup.assetsElements.length > 0 && buildAssets === true) {
      // Load all scene assets
      sceneMarkup.assetsElements.map(asset => {
        this.assetMarkupGallery += asset;
      });
    }

    let tiles = `${sceneMarkup.innerMarkup}
    `;
    gallery.tiles.forEach(tile => {
      tiles = `${tiles}${tile}`;
    })

    if (document.getElementById(`gallery`) !== null) {
      document.getElementById(`gallery`).innerHTML = tiles;
    }

    if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
      var assets = document.createElement("a-assets");
      assets.setAttribute("timeout", 60000);
      document.getElementById("scenes").before(assets);
    } else {
      document.querySelector('a-assets').remove();
    }
    document.querySelector("a-assets").innerHTML = this.assetMarkupGallery;

    document.querySelector("a-assets").addEventListener('loaded', () => {
      console.log("GALLERY ASSETS LOADED");
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
  }

  loadGallery() {
    let sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '') {
      // Set the scene.
      this.updateTemplate(sceneSelector, "gallery");
    }
  }

  // Update the selected story
  galleryItemSelect(id) {
    console.log("gallery", id);
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
    this.storySettings.target = null;
    this.showLoading = true;
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
    console.log("SETTING UP STORY");
    let storyboxAframe = new StoryboxAframe();

    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    let buildAssets = true;
    if (this.assetMarkup !== ``) {
      buildAssets = false;
    }
    currentStory.scenes.map(sceneJson => {
      // Get markup chunks for aframe
      let sceneMarkup = storyboxAframe.render(sceneJson);

      if (typeof sceneMarkup.assetItemElements !== 'string' && sceneMarkup.assetItemElements.length > 0 && buildAssets) {
        // Load all scene assets
        sceneMarkup.assetItemElements.map(asset => {
          this.assetMarkup += asset;
        });
      }

      if (typeof sceneMarkup.assetsElements !== 'string' && sceneMarkup.assetsElements.length > 0 && buildAssets) {
        // Load all scene assets
        sceneMarkup.assetsElements.map(asset => {
          this.assetMarkup += asset;
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


    // Aggregate assets in loader
    document.querySelector('a-assets').remove();
    if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
      var assets = document.createElement("a-assets");
      assets.setAttribute("timeout", 60000);
      document.getElementById("scenes").before(assets);
    }
    document.querySelector("a-assets").innerHTML = this.assetMarkup;
    this.update();

    document.querySelector("a-assets").addEventListener('loaded', () => {
      console.log("STORY ASSETS LOADED");
      this.showLoading = false;
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

  setupAppButtons() {
    AFRAME.registerComponent('x-button-listener', {
      init: function () {
        var el = this.el;
        el.addEventListener('xbuttondown', function (evt) {
          console.log('down');
          this.loadGallery();
        });
      }
    });



    window.addEventListener("keydown", (e) => {
      // var player = document.querySelector("a-camera");
      // if (e.code === "KeyR") {
      //    var angle = player.getAttribute("rotation")
      //    var x = 1 * Math.cos(angle.y * Math.PI / 180)
      //    var y = 1 * Math.sin(angle.y * Math.PI / 180)
      //    var pos = player.getAttribute("position")
      //    pos.x -= y;
      //    pos.z -= x;
      //    player.setAttribute("position", pos);
      // }

      if (e.code === "KeyX") {
        this.loadGallery();
      }
     })
  }

  vrDebugger() {
      var old = console.log;
      var logVR = document.getElementById('debugger-log-vr');

      ['log', 'debug', 'error'].forEach(function(verb) {
        console[verb] = (function(method, verb, logVR) {
          return function() {
            method.apply(console, arguments);
            var msg = document.createElement('div');
            msg.classList.add(verb);
            msg.textContent = verb + ': ' + Array.prototype.slice.call(arguments).join(' ');
            if (logVR !== null) {
              let vrLogJson = logVR.getAttribute('text');
              if (typeof vrLogJson === 'object') {
                vrLogJson.value = `${vrLogJson.value} ${verb + ': ' + Array.prototype.slice.call(arguments).join(' ')}`;
                logVR.setAttribute('text', vrLogJson);
              }
            }
          };
        })(console[verb], verb, logVR);
      });
    }


  updateEventListeners() {
    document.querySelector('#scene-selector').addEventListener("click", (e) => {
      if (e.target.id !== null && e.target.id !== '') {
        let el = document.getElementById(e.target.id);
        switch (e.target.id) {
          case 'play-button':
            el = document.getElementById(e.target.id);
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
        }
      }

      if (e.detail !== undefined && e.detail.intersectedEl !== undefined) {
        let el = e.detail.intersectedEl;
        console.log(el);
        if (el.getAttribute('class') === 'clickable-tile') {
          // console.log(el.getAttribute('id'));
          if(el.getAttribute('data-clicked') === null || el.getAttribute('data-clicked') === 'false') {
             el.setAttribute('data-clicked', 'true');
             let id = el.getAttribute('id');
             if (id !== undefined && id !== null) {
               this.galleryItemSelect(id);
             }
           } else {
             el.setAttribute('data-clicked', 'false');
           }
        }

      }

    });


    this.vrDebugger();

  }

  render(target) {
    this.storySettings.target = target;
  }
}

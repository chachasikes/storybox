import { Gallery } from "./gallery.js";
import { vrlog } from "./utilities/vrlog.js";
import { testPositions } from "./utilities/testPositions.js";
import modelLoadedEvent from "./utilities/modelUpdates.js";
import { registerComponent as behaviorAccordionStretch } from "./components/accordion-stretch.js";
import { registerComponent as behaviorIntersectionPlay } from "./components/accordion-stretch.js";
import { registerComponent as behaviorGltfMaterial } from "./components/accordion-stretch.js";
import { registerComponent as behaviorXButtonListener } from "./components/x-button-listener.js";
import { registerComponent as behaviorYButtonListener } from "./components/y-button-listener.js";
import { registerComponent as behaviorAButtonListener } from "./components/a-button-listener.js";
import { registerComponent as behaviorBButtonListener } from "./components/b-button-listener.js";


export class StoryBoxBuilder {
  constructor() {
    this.storySettings = {};
    this.storySettings.timer = null;
    this.storySettings.target = null;
    this.storySettings.transition = null;
    this.storySettings.galleryListeners = false;
    this.assetMarkup = ``;
    this.assetMarkupGallery = ``;
    this.showLoading = false;
    this.registry = [];
    this.storySettings.currentStory = "gallery";
    this.hash = window.location.hash.replace('#', '');
    window.VRLog = {};
    window.VRLog.logQueue = [];
    this.testPosition = 0;
    this.testPositions = testPositions;
    this.modelLoadedEvent = modelLoadedEvent;
  }

  init(parent) {
    this.appKeyStrokes();
    if (parent !== undefined) {
      this.registry = parent.registry;
      this.gallerySceneJson = parent.gallerySceneJson;
    }
    if (this.hash !== '') {
      console.log('hash', this.hash);
      this.galleryItemSelect(this.hash);

    } else {
      this.setupGallery(parent);
    }
  }

  setupGallery(parent) {
    clearTimeout(this.storySettings.timer);

    if (this.registry !== undefined) {
      let rebuildAssets = true;
      // Already built before
      // if (this.assetMarkupGallery !== ``) {
      //   rebuildAssets = false;
      // }

      window.Gallery = new Gallery();
      let gallery = window.Gallery.render(this.registry);
      if (
        typeof gallery.assetsElements !== "string" &&
        gallery.assetsElements.length > 0 &&
        rebuildAssets === true
      ) {
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
      let sceneMarkup = window.StoryboxAframe.render(this.gallerySceneJson);
      if (sceneMarkup !== undefined) {
        if (
          typeof sceneMarkup.assetsElements !== "string" &&
          sceneMarkup.assetsElements.length > 0 &&
          rebuildAssets === true
        ) {
          // Load all scene assets
          sceneMarkup.assetsElements.map(asset => {
            this.assetMarkupGallery += asset;
          });
        }

        let tiles = `${sceneMarkup.innerMarkup}`;
        gallery.tiles.forEach(tile => {
          tiles = `${tiles}${tile}`;
        });

        if (document.getElementById(`gallery`) !== null) {
          document.getElementById(`gallery`).innerHTML = tiles;
        }

        if (
          document.querySelector("a-assets") !== undefined &&
          document.querySelector("a-assets") !== null
        ) {
          document.querySelector("a-assets").remove();
        }
        if (
          document.querySelector("a-assets") === undefined ||
          document.querySelector("a-assets") === null
        ) {
          var assets = document.createElement("a-assets");
          assets.setAttribute("timeout", 60000);
          document.getElementById("scenes").before(assets);
        }
        document.querySelector("a-assets").innerHTML = this.assetMarkupGallery;

        document.querySelector("a-assets").addEventListener("loaded", () => {
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
          sceneSelectorEl.setAttribute("scene-selector-listener", "");
          document.getElementById("scenes").append(sceneSelectorEl);
        }
        sceneSelector = document.getElementById("scene-selector");
        if (
          sceneSelector !== undefined &&
          sceneSelector !== null &&
          sceneSelector !== ""
        ) {
          // Set the scene.
          this.updateTemplate(sceneSelector, "gallery");
        }
      }
    }
  }

  loadGallery() {
    this.setupGallery();
  }

  // Update the selected story
  galleryItemSelect(id) {
    console.log('id', id);
    // Set the story id.
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
    // this.storySettings.stretchLine = null; // Experiment
    // Render the markup to trigger aframe to load the scene.
    this.setupStory();
  }

  // Load the current story.
  getCurrentStory(id) {
    if (this.registry !== undefined) {
      let story = this.registry.filter(item => item.id === id);
      if (story !== undefined && story.length > 0) {
        return story[0];
      }
      return null;
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

  // Build assets for all story scenes
  setupStory() {
    // Stop any timers.
    clearTimeout(this.storySettings.timer);
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);

    let rebuildAssets = true;
    // if (this.assetMarkup !== ``) {
    //   rebuildAssets = false;
    // }
    // Read all scenes in the story & convert JSON to aframe tags.
    if (currentStory !== null) {
      currentStory.scenes.map(sceneJson => {
        // Get markup chunks for aframe
        let sceneMarkup = window.StoryboxAframe.render(sceneJson);

        if (
          typeof sceneMarkup.assetItemElements !== "string" &&
          sceneMarkup.assetItemElements.length > 0 &&
          rebuildAssets
        ) {
          // Load all scene assets
          sceneMarkup.assetItemElements.map(asset => {
            this.assetMarkup += asset;
          });
        }

        if (
          typeof sceneMarkup.assetsElements !== "string" &&
          sceneMarkup.assetsElements.length > 0 &&
          rebuildAssets
        ) {
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
          document.getElementById(`${sceneJson.id}`).innerHTML =
            sceneMarkup.innerMarkup;
        }
      });

      // Aggregate assets in loader
      if (
        document.querySelector("a-assets") !== undefined &&
        document.querySelector("a-assets") !== null
      ) {
        document.querySelector("a-assets").remove();
      }
      if (
        document.querySelector("a-assets") === undefined ||
        document.querySelector("a-assets") === null
      ) {
        var assets = document.createElement("a-assets");
        assets.setAttribute("timeout", 60000);
        document.getElementById("scenes").before(assets);
      }
      document.querySelector("a-assets").innerHTML = this.assetMarkup;

      this.update();

      document.querySelector('a-scene').addEventListener('enter-vr', function () {
         console.log("ENTERED VR");

         document.getElementById('scene-selector').setAttribute('entered-vr', true);
         window.StoryBoxBuilder.update();
      });

      document.querySelector("a-assets").addEventListener("loaded", () => {
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
    this.playGLBAnimation();
  }

  playGLBAnimation() {
    let animation = document.querySelector(".glb-animation");
    // @TODO
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
    currentStory.currentScene =
      currentStory.currentScene > 0 ? currentStory.currentScene - 1 : 0;
    this.update();
    clearTimeout(this.storySettings.timer);
    this.playScene();
  }

  nextScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene =
      currentStory.currentScene < currentStory.numberScenes
        ? currentStory.currentScene + 1
        : currentStory.numberScenes;
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
    this.aframeMutations();
  }

  update() {
    this.render(this.storySettings.target);
    let currentScene = this.getCurrentScene(this.storySettings.currentStory);
    let sceneSelector;
    if (document.getElementById("scene-selector") === null) {
      // Add main entity for all aFrame content, add to a-scene set in index.html
      let sceneSelectorEl = document.createElement("a-entity");
      sceneSelectorEl.setAttribute("id", "scene-selector");
      sceneSelectorEl.setAttribute("scene-selector-listener", "");
      document.getElementById("scenes").append(sceneSelectorEl);
    }

    sceneSelector = document.getElementById("scene-selector");
    if (
      sceneSelector !== undefined &&
      sceneSelector !== null &&
      sceneSelector !== "" &&
      currentScene !== undefined &&
      currentScene !== null
    ) {
      // Set the scene.
      console.log('update template', currentScene.id);
      this.updateTemplate(sceneSelector, currentScene.id);
    }
  }

  xButtonEvent(evt) {
    vrlog("X");
    window.StoryBoxBuilder.loadGallery();
  }

  yButtonEvent(evt) {
    vrlog("Y");
    this.updateTestPositions();
  }

  hitEvent(evt) {
    window.StoryBoxBuilder.debounce(window.StoryBoxBuilder.hitEvent, 2000);
  }

  setupAppBehaviors() {
    behaviorXButtonListener();
    behaviorYButtonListener();
    behaviorAButtonListener();
    behaviorBButtonListener();
    behaviorGltfMaterial();
    behaviorAccordionStretch();
    behaviorIntersectionPlay();
  }

  debounce(fn, delay) {
    var timer = null;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      console.log('debounce');
      timer = setTimeout(function() {
        console.log('setting timeout')
        fn.apply(context, args);
      }, delay);
    };
  }

  throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function() {
      var context = scope || this;

      var now = +new Date(),
        args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  updateTestPositions() {
    this.testPosition = this.testPosition + 1;
    if (this.testPosition >= this.testPositions.length) {
      this.testPosition = 0;
    }
    let camera = document.getElementById("rig");
    if (camera !== null) {
      let updateTestPosition = camera.getAttribute("updateTestPosition");
      if (
        updateTestPosition !== undefined &&
        updateTestPosition !== null &&
        typeof window.StoryBoxBuilder[updateTestPosition] === "function"
      ) {
        window.StoryBoxBuilder[updateTestPosition](this);
      }
    }
  }

  sceneSelectorUpdateEvent() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    if (
      currentStory !== undefined &&
      currentStory !== null &&
      currentStory.name !== undefined
    ) {
      vrlog(currentStory.name + " Loaded.");
    }
  }

  sceneSelectorEventListeners(e) {
    if (e.target.id !== null && e.target.id !== "") {
      let el = document.getElementById(e.target.id);
      switch (e.target.id) {
        case "play-button":
          el = document.getElementById(e.target.id);
          if (
            el.getAttribute("data-clicked") === null ||
            el.getAttribute("data-clicked") === "false"
          ) {
            el.setAttribute("data-clicked", "true");
            this.storySettings.transition = window.setTimeout(
              function() {
                clearTimeout(this.storySettings.transition);
                window.StoryBoxBuilder.nextScene();
              }.bind(this),
              5000
            );
          } else {
            el.setAttribute("data-clicked", "false");
          }
          break;
      }
    }

    // Click gallery item to load a story.
    if (e.detail !== undefined && e.detail.intersectedEl !== undefined) {
      let el = e.detail.intersectedEl;
      if (el.getAttribute("class") === "clickable-tile") {
        if (
          el.getAttribute("data-clicked") === null ||
          el.getAttribute("data-clicked") === "false"
        ) {
          el.setAttribute("data-clicked", "true");
          let id = el.getAttribute("id");
          if (id !== undefined && id !== null) {
            this.galleryItemSelect(id);
          }
        } else {
          el.setAttribute("data-clicked", "false");
        }
      }
    }
  }

  aframeMutations() {
    // Options for the observer (which mutations to observe)
    var config = {
      attributes: true,
      childList: true,
      subtree: true
    };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (mutation.target.id === "debugger-log-vr-bkg") {
          // update all logs
          window.VRLog.logQueue.forEach(message => {
            vrlog(message);
          });
          window.VRLog.logQueue = [];
        }
        if (mutation.target.id === "scene-selector") {
          window.StoryBoxBuilder.sceneSelectorUpdateEvent();
        }
        this.updateEventListeners();
        this.setupAppBehaviors();
        this.modelLoadedEvent();
      }
    }.bind(this);

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(document.body, config);

    // Later, you can stop observing
    // observer.disconnect();
  }

  appKeyStrokes() {
    window.addEventListener("keydown", e => {
      // console.log(e.code);
      if (e.code === "KeyX") {
        // console.log('x');
        vrlog("X");
        this.loadGallery();
      }
      if (e.code === "KeyY") {
        vrlog("Y");
        // console.log('Y')
        this.updateTestPositions();
      }
    });

    if (typeof window.StoryBoxBuilder.intersectAction === 'function') {
      window.addEventListener("hit", window.StoryBoxBuilder.intersectAction);
    }
  }

  updateEventListeners() {
    // Reset debugger message throttler.
    window.debugCounter = 0;

    if (this.storySettings.galleryListeners === false) {
      document
        .querySelector("#scene-selector")
        .addEventListener("click", e => this.sceneSelectorEventListeners(e));
    }
    this.storySettings.galleryListeners = true;
    // Set globally readable event names
    window.StoryBoxBuilder.xButtonEvent = this.xButtonEvent;
    window.StoryBoxBuilder.yButtonEvent = this.yButtonEvent;

    // @TODO rethink.
    if (document.querySelectorAll('.sphere-intersection')) {
      let intersectionElements = document.querySelectorAll('.sphere-intersection');
      intersectionElements.forEach(item => {
        let action = item.getAttribute('intersectAction');
        if (action !== null && typeof window.StoryBoxBuilder[action] === 'function') {
          window.StoryBoxBuilder.intersectAction = window.StoryBoxBuilder[action];
        }
      });
    }
    window.StoryBoxBuilder.modelLoadedEvent = this.modelLoadedEvent;
  }

  render(target) {
    this.storySettings.target = target;
  }
}

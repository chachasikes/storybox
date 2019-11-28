import { Gallery } from "./gallery.js";
import { vrlog } from "./utilities/vrlog.js";
import { testPositions } from "./utilities/testPositions.js";
import modelLoadedEvent from "./utilities/modelUpdates.js";
import { registerComponent as behaviorAccordionStretch } from "./components/accordion-stretch.js";
import { registerComponent as behaviorIntersectionPlay } from "./components/intersection-play.js";
import { registerComponent as behaviorGltfMaterial } from "./components/accordion-stretch.js";
import { registerComponent as behaviorXButtonListener } from "./components/x-button-listener.js";
import { registerComponent as behaviorYButtonListener } from "./components/y-button-listener.js";
import { registerComponent as behaviorAButtonListener } from "./components/a-button-listener.js";
import { registerComponent as behaviorBButtonListener } from "./components/b-button-listener.js";
import { registerComponent as behaviorSphereIntersection } from "./components/sphere-intersection.js";
import { registerComponent as gltfOpacity } from "./components/gltf-model-opacity.js";
import { registerComponent as modelMaterial } from "./components/model-material.js";
import { registerComponent as objOpacity } from "./components/obj-model-opacity.js";

/**
 * Build StoryboxNavigator
 * @module StoryboxNavigator
 */
export class StoryboxNavigator {
  constructor() {
    this.storySettings = {};
    this.storySettings.timer = null;
    this.storySettings.target = null;
    this.storySettings.transition = null;
    this.storySettings.galleryListeners = false;
    this.assetMarkup = ``;
    this.galleryMarkup = ``;
    this.showLoading = false;
    this.registry = [];
    this.storySettings.currentStory = "gallery";
    this.hash = window.location.hash.replace("#", "");
    window.VRLog = {};
    window.VRLog.logQueue = [];
    this.testPosition = 0;
    this.testPositions = testPositions;
    this.modelLoadedEvent = modelLoadedEvent;
    this.rebuildGalleryGrid = true;
    this.rebuildGalleryScene = true;

    this.gallery = null;
    this.gallerySceneMarkup = ``;
  }

  /**
   * Using data from App
   *
   * @param {object} parent - Parent object
   * @param {array} parent.registry - Parent object
   * @param {object} parent.galleryScene - Scene describing Gallery environment
   * @param {string} this.hash - Current hash for loading items
   */
  init(parent) {
    // Listen for desktop keystrokes.
    this.appKeyStrokes();
    console.log('init');
    window.addEventListener("hashchange", this.handleHashChange, false);
    if (parent !== undefined) {
      this.registry = parent.registry;
      this.galleryScene = parent.galleryScene;
    }
    if (this.hash !== "") {
      console.log("hash", this.hash);
      this.galleryItemSelect(this.hash);
    } else {
      console.log("Load Gallery.");
      this.setupGallery(parent);
    }
  }

  /**
   * Handle hash change
   */
  handleHashChange() {
    console.log("Hash change");
    this.hash = window.location.hash.replace("#", "");
  }

  /**
   * Build Gallery item grid
   */
  buildGalleryItems() {
    // Build gallery grid.
    window.Gallery = new Gallery();
    this.gallery = window.Gallery.render(this.registry);
    if (
      typeof this.gallery.preloadElements !== "string" &&
      this.gallery.preloadElements.length > 0 &&
      this.rebuildGalleryGrid === true
    ) {
      // Load all scene assets
      this.gallery.preloadElements.map(asset => {
        // Add gallery assets to preloader.
        this.galleryMarkup += asset;
      });
      // Concatenate the image tile markup.
      this.gallery.innerMarkup = ``;
      this.gallery.grid.forEach(tile => {
        this.gallery.innerMarkup = `${this.gallery.innerMarkup}${tile}`;
      });
    }
    // Don't rebuild gallery.
    this.rebuildGalleryGrid = false;
  }

  /**
   * Build Gallery scene
   */
  buildGalleryScene() {
    this.gallerySceneMarkup = window.StoryboxAframe.render(this.galleryScene);
    // console.log(this.gallerySceneMarkup);
    if (this.gallerySceneMarkup !== undefined) {
      if (
        typeof this.gallerySceneMarkup.childElements !== "string" &&
        this.gallerySceneMarkup.childElements.length > 0
        // this.rebuildGalleryScene === true
      ) {
        // Load all scene assets for a-assets
        this.gallerySceneMarkup.childElements.map(asset => {
          this.galleryMarkup += asset;
        });
      }

      // Don't rebuild gallery scene.
      this.rebuildGalleryScene === false;
    }
  }

  buildGallery() {

    // Update assets for gallery
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

    // Set assets.
    document.querySelector("a-assets").innerHTML = this.galleryMarkup;

    if (document.getElementById("gallery") !== null &&
        this.gallery.innerMarkup !== ``) {
      // Append grid images content to gallery container.
      document.getElementById("gallery").innerHTML = `${this.gallerySceneMarkup.innerMarkup}${this.gallery.innerMarkup}`; //
    }

    // Add gallery scene to list of scenes.
    var sceneScript = document.createElement("script");
    sceneScript.type = "text/html";
    sceneScript.id = "gallery";
    if (document.getElementById("gallery") === null) {
      document.getElementById("scenes").append(sceneScript);
    }
    // Add main entity for all aFrame content, add to a-scene set in index.html
    if (document.getElementById("scene-selector") === null) {
      let sceneSelectorEl = document.createElement("a-entity");
      sceneSelectorEl.setAttribute("id", "scene-selector");
      sceneSelectorEl.setAttribute("scene-selector-listener", "");
      document.getElementById("scenes").append(sceneSelectorEl);
    }
  }

  updateGallery() {
    this.storySettings.currentStory = "gallery";
    // Set current story.
    document.querySelector("a-assets").addEventListener("loaded", () => {
      let currentScene = "gallery";
      if (currentScene && currentScene.autoPlay === true) {
        this.pauseScene();
      }
    });

    // Update template
    let sceneSelector = document.getElementById("scene-selector");
    if (
      sceneSelector !== undefined &&
      sceneSelector !== null &&
      sceneSelector !== ""
    ) {
      // Set the scene.
      this.updateTemplate(sceneSelector, "gallery");
    }
  }

  /**
   * Create interactive gallery.
   *
   * @param {object} parent - Parent object
   */
  setupGallery(parent) {
    clearTimeout(this.storySettings.timer);

    if (this.registry !== undefined) {
      // this.buildGalleryScene();
      // this.buildGalleryItems();
      // this.buildGallery();
      // this.updateGallery();

      let rebuildAssets = true;
         // Already built before
         // if (this.galleryMarkup !== ``) {
         //   rebuildAssets = false;
         // }

         window.Gallery = new Gallery();
         let gallery = window.Gallery.render(this.registry);
         if (
           typeof gallery.childElements !== "string" &&
           gallery.childElements.length > 0 &&
           rebuildAssets === true
         ) {
           // Load all scene assets
           gallery.childElements.map(item => {
             this.galleryMarkup += item;
           });
         }

         // Set up dynamically loadable scenes.
         var sceneScript = document.createElement("script");
         sceneScript.type = "text/html";
         sceneScript.id = "gallery";
         document.getElementById("scenes").append(sceneScript);
         let sceneMarkup = window.StoryboxAframe.render(this.galleryScene);
         if (sceneMarkup !== undefined) {
           if (
             typeof sceneMarkup.childElements !== "string" &&
             sceneMarkup.childElements.length > 0 &&
             rebuildAssets === true
           ) {
             // Load all scene assets
             sceneMarkup.childElements.map(item => {
               this.galleryMarkup += item;
             });
           }

           let scene = `${sceneMarkup.innerMarkup}`;
           // console.log(scene);
           gallery.grid.forEach(item => {
             // console.log(item);
             scene += item;
           });

           if (document.getElementById("gallery") !== null) {
             document.getElementById("gallery").innerHTML = scene;
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

           document.querySelector("a-assets").innerHTML = this.galleryMarkup;

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

  /**
   * Load gallery.
   */
  loadGallery() {
    this.setupGallery();
  }

  /**
   * Select and update story.
   *
   * @param {string} id - Id from hash
   */
  galleryItemSelect(id) {
    console.log("id", id);
    // Set the story id.
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
    window.location.hash = "#" + id;
    // this.storySettings.stretchLine = null; // Experiment
    // Render the markup to trigger aframe to load the scene.
    this.setupStory();
  }

  /**
   * Load the current story.
   *
   * @param {string} id - Id from hash
   */
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

  /**
   * Load data from the current scene
   *
   * @param {string} id - Id from hash
   */
  getCurrentScene(id) {
    let story = this.registry.filter(item => item.id === id);
    if (story !== undefined && story.length > 0) {
      return story[0].scenes[story[0].currentScene];
    }
    return null;
  }

  /**
   * Build assets for all scenes in current story.
   */
  setupStory() {
    // Stop any timers.
    clearTimeout(this.storySettings.timer);
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);

    let rebuildGalleryGrid = true;
    // if (this.assetMarkup !== ``) {
    //   rebuildGalleryGrid = false;
    // }
    // Read all scenes in the story & convert JSON to aframe tags.
    if (currentStory !== null) {
      currentStory.scenes.map(sceneJson => {
        // Get markup chunks for aframe
        let sceneMarkup = window.StoryboxAframe.render(sceneJson);

        if (
          typeof sceneMarkup.preloadElements !== "string" &&
          sceneMarkup.preloadElements.length > 0 &&
          rebuildGalleryGrid
        ) {
          // Load all scene assets
          sceneMarkup.preloadElements.map(asset => {
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

      document
        .querySelector("a-scene")
        .addEventListener("enter-vr", function() {
          console.log("ENTERED VR");

          document
            .getElementById("scene-selector")
            .setAttribute("entered-vr", true);
          window.StoryboxNavigator.update();
        });

      document.querySelector("a-assets").addEventListener("loaded", () => {
        this.showLoading = false;
        this.update();

        let currentScene = this.getCurrentScene(
          this.storySettings.currentStory
        );
        if (currentScene && currentScene.autoPlay === true) {
          this.play();
        } else {
          this.pauseScene();
        }
      });

      document.querySelector("a-assets").addEventListener("sound-loaded", function(){
        console.log("sound loaded");
      });

      document.addEventListener("sound-ended", function(){
        console.log("sound ended");
      });
    }
  }

  /**
   * Play current scene (duration and animation)
   *
   * @param {string} id - Id from hash
   */
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

  /**
   * Play GLTF animation
   */
  playGLBAnimation() {
    let animation = document.querySelector(".glb-animation");
    // @TODO
  }

  /**
   * Pause current scene.
   */
  pauseScene() {
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  /**
   * Stop current scene.
   */
  stopScene() {
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  /**
   * Go to previous scene
   */
  previousScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene =
      currentStory.currentScene > 0 ? currentStory.currentScene - 1 : 0;
    this.update();
    clearTimeout(this.storySettings.timer);
    this.playScene();
  }

  /**
   * Go to next scene
   */
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

  /**
   * Go to first scene
   */
  firstScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = 0;
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  /**
   * Go to last scene
   */
  lastScene() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = currentStory.numberScenes;
    clearTimeout(this.storySettings.timer);
    this.update();
  }

  /**
   * Play story
   */
  play() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    currentStory.currentScene = 0;
    clearTimeout(this.storySettings.timer);
    this.playScene();
    this.playSound();
  }

  setupAmbisonicSound() {

    // Set up an audio element to feed the ambisonic source audio feed.
    const audioElement = document.createElement('audio');
    audioElement.src = 'audio-file-foa-acn.wav';


    var entities = window.document.querySelectorAll('[sound]');

    entities.map(entity => {
      var sound = entity.components.sound;
      // original aframe sound player. entity.components.sound.playSound();
        //
        // Create AudioContext, MediaElementSourceNode and FOARenderer.

        // https://github.com/GoogleChrome/omnitone#omnitone-spatial-audio-on-the-web
        const audioContext = new AudioContext();
        const audioElementSource = audioContext.createMediaElementSource(entity);
        const foaRenderer = Omnitone.createFOARenderer(audioContext);

        // Make connection and start play. Hook up the user input for the playback.
        foaRenderer.initialize().then(function() {
          audioElementSource.connect(foaRenderer.input);
          foaRenderer.output.connect(audioContext.destination);

          // This is necessary to activate audio playback out of autoplay block.
          // someButton.onclick = () => {
          //   audioContext.resume();
          //   audioElement.play();
          // };
        });
    })

  }

  playSound() {
    console.log("play");
    var entity = window.document.querySelector('[sound]');
    console.log('entity', entity);
    if (entity !== null) {
      entity.components.sound.playSound();
      // this.setupAmbisonicSound(); // Actually not necessary?
    }
  }

  pauseSound() {
    var entity = window.document.querySelector('[sound]');
    console.log('ent pause', entity)
    if (entity !== null) {
      entity.components.sound.pauseSound();
      console.log('pausing sound');
    }
  }

  stopSound() {
    var entity = document.querySelector('[sound]');
    if (entity !== null) {
      entity.components.sound.pauseSound();
    }
  }

  /**
   * Replay story
   */
  replayScene() {
    this.playScene();
  }

  /**
   * Update scene element with template.
   * Requires aframe-template-component.min.js
   * @param {string} el - target element to update;
   * @param {string} id - id to use when updating target element
   */
  updateTemplate(el, id) {
    el.setAttribute("template", `src: #${id}`);
    // Listen for observed DOM mutations.
    this.aframeMutations();
  }

  /**
   * Update scene
   */
  update() {
    this.setTarget(this.storySettings.target);
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
      console.log("update template", currentScene.id);
      this.updateTemplate(sceneSelector, currentScene.id);
    }
  }

  /**
   * Global behavior of X button
   * @param {object} e - Javascript event.
   */
  xButtonEvent(e) {
    vrlog("X");
    window.StoryboxNavigator.loadGallery();
  }

  /**
   * Global behavior of Y button
   * @param {object} e - Javascript event.
   */
  yButtonEvent(e) {
    vrlog("Y");
    this.updateTestPositions();
    window.StoryboxNavigator.pauseSound();
  }

  /**
   * Behavior of hit event.
   * @param {object} e - Javascript event.
   */
  hitEvent(e) {
    // @TODO still necessary?
    // Debounced hit event.
    window.StoryboxNavigator.debounce(window.StoryboxNavigator.hitEvent, 2000);
  }

  /**
   * Load Storybox Aframe components
   */
  setupAppBehaviors() {
    behaviorXButtonListener();
    behaviorYButtonListener();
    behaviorAButtonListener();
    behaviorBButtonListener();
    behaviorGltfMaterial();
    behaviorAccordionStretch();
    behaviorIntersectionPlay();
    behaviorSphereIntersection();
    gltfOpacity();
    objOpacity();
    modelMaterial();
  }

  /**
   * Debounce function
   * @param {function} fn - Callback function
   * @param {number} delay - Debouce delay in milliseconds
   */
  debounce(fn, delay) {
    var timer = null;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      // console.log("debounce");
      timer = setTimeout(function() {
        // console.log("setting timeout");
        fn.apply(context, args);
      }, delay);
    };
  }

  /**
   * Throttle function
   * @param {function} fn - Callback function
   * @param {number} threshold - Debouce delay in milliseconds
   * @param scope -
   */
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

  /**
   * Update location of hands for testing in browser or viewing in desktop.
   */
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
        typeof window.StoryboxNavigator[updateTestPosition] === "function"
      ) {
        window.StoryboxNavigator[updateTestPosition](this);
      }
    }
  }

  /**
   * Update scene & log it.
   */
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

  /**
   * Listen for scene selection.
   * @param {object} e - Event
   */
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
                window.StoryboxNavigator.nextScene();
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

  /**
   * Listen for DOM mutations (required to ensure Aframe and ThreeJS events have fully propagated.)
   */
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
          window.StoryboxNavigator.sceneSelectorUpdateEvent();
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

  /**
   * Listen for key strokes
   */
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
        this.pauseSound();
      }
    });

    if (typeof window.StoryboxNavigator.intersectAction === "function") {
      window.addEventListener("hit", window.StoryboxNavigator.intersectAction);
    }
  }

  /**
   * Change event listeners when the story changes
   */
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
    window.StoryboxNavigator.xButtonEvent = this.xButtonEvent;
    window.StoryboxNavigator.yButtonEvent = this.yButtonEvent;

    // @TODO rethink.
    if (document.querySelectorAll(".sphere-intersection")) {
      let intersectionElements = document.querySelectorAll(
        ".sphere-intersection"
      );
      intersectionElements.forEach(item => {
        let action = item.getAttribute("intersectAction");
        if (
          action !== null &&
          typeof window.StoryboxNavigator[action] === "function"
        ) {
          window.StoryboxNavigator.intersectAction =
            window.StoryboxNavigator[action];
        }
      });
    }
    window.StoryboxNavigator.modelLoadedEvent = this.modelLoadedEvent;
  }

  /**
   * Set the current story.
   * @param {string} target - Id target of selected story.
   */
  setTarget(target) {
    this.storySettings.target = target;
  }
}

import { Gallery } from "./gallery.js";
import { updateAccordionLine } from "./interfaceAccordion.js";
import { vrlog } from "./vrlog.js";
import { testPositions } from './testPositions.js';

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
    // this.debug = "rose_accordion";
    this.debug = null;

    window.VRLog = {};
    window.VRLog.logQueue = [];
    this.testPosition = 0;
    window.updateAccordionLine = updateAccordionLine;
    this.testPositions = testPositions;
  }

  init(parent) {
    this.appKeyStrokes();
    if (this.debug !== null && window.location.hostname === 'localhost') {
      this.galleryItemSelect(this.debug);
    } else {
      this.setupGallery(parent);
    }
  }

  setupGallery(parent) {
    this.registry = parent.registry;
    this.gallerySceneJson = parent.gallerySceneJson;
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
      console.log(this.gallerySceneJson, window.StoryboxAframe);
      let sceneMarkup = window.StoryboxAframe.render(this.gallerySceneJson);
      if ( sceneMarkup !== undefined) {
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
    // Set the story id.
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
    // this.storySettings.stretchLine = null; // Experiment
    // Render the markup to trigger aframe to load the scene.
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

  // Build assets for all story scenes
  setupStory() {
    // Stop any timers.
    clearTimeout(this.storySettings.timer);
    // clearInterval(this.storySettings.stretchLine);

    let currentStory = this.getCurrentStory(this.storySettings.currentStory);

    let rebuildAssets = true;
    // if (this.assetMarkup !== ``) {
    //   rebuildAssets = false;
    // }
    // Read all scenes in the story & convert JSON to aframe tags.
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
      this.updateTemplate(sceneSelector, currentScene.id);
    }
  }

  xButtonEvent(evt) {
    window.StoryBoxBuilder.loadGallery();
  }

  setupAppButtons() {
    if (AFRAME.components["x-button-listener"] === undefined) {
      AFRAME.registerComponent("x-button-listener", {
        init: function() {
          var el = this.el;
          el.addEventListener(
            "xbuttondown",
            window.StoryBoxBuilder.xButtonEvent
          );
        },
        update: function() {
          var el = this.el;
          el.addEventListener(
            "xbuttondown",
            window.StoryBoxBuilder.xButtonEvent
          );
        }
      });
    }

    if (AFRAME.components["y-button-listener"] === undefined) {
      AFRAME.registerComponent("y-button-listener", {
        init: function() {
          var el = this.el;
          el.addEventListener("ybuttondown", function(evt) {
            vrlog("Y");
          });
        }
      });
    }

    if (AFRAME.components["a-button-listener"] === undefined) {
      AFRAME.registerComponent("a-button-listener", {
        init: function() {
          var el = this.el;
          el.addEventListener("abuttondown", function(evt) {
            vrlog("A");
          });
        }
      });
    }

    if (AFRAME.components["b-button-listener"] === undefined) {
      AFRAME.registerComponent("b-button-listener", {
        init: function() {
          var el = this.el;
          el.addEventListener("bbuttondown", function(evt) {
            vrlog("B");
          });
        }
      });
    }

    if (AFRAME.components["left-controller-listener"] === undefined) {
      AFRAME.registerComponent("left-controller-listener", {
        init: function() {
          var el = this.el;
        },
        tick: function() {
          if (
            typeof window.StoryBoxBuilder.leftControllerTickEvent === "function"
          ) {
            window.StoryBoxBuilder.leftControllerTickEvent(parent);
          }
        }
      });
    }

    if (AFRAME.components["right-controller-listener"] === undefined) {
      AFRAME.registerComponent("right-controller-listener", {
        init: function() {
          var el = this.el;
        },
        tick: function() {
          if (
            typeof window.StoryBoxBuilder.rightControllerTickEvent ===
            "function"
          ) {
            window.StoryBoxBuilder.rightControllerTickEvent(parent);
          }
        }
      });
    }
  }

  debounce(fn, delay) {
    var timer = null;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
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
        typeof window[updateTestPosition] === "function"
      ) {
        window[updateTestPosition](this);
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
        this.setupAppButtons();
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

    if (document.getElementById("leftHand") !== null) {
      let tickFunctionLeft = document
        .getElementById("leftHand")
        .getAttribute("tickFunction");
      if (
        tickFunctionLeft !== undefined &&
        window.StoryBoxBuilder[tickFunctionLeft] !== undefined &&
        typeof window.StoryBoxBuilder[tickFunctionLeft] === "function"
      ) {
        window.StoryBoxBuilder.leftControllerTickEvent =
          window.StoryBoxBuilder[tickFunctionLeft];
      } else {
        window.StoryBoxBuilder.leftControllerTickEvent = null;
      }
    }
    if (document.getElementById("rightHand") !== null) {
      let tickFunctionRight = document
        .getElementById("rightHand")
        .getAttribute("tickFunction");
      if (
        tickFunctionRight !== undefined &&
        window.StoryBoxBuilder[tickFunctionRight] !== undefined &&
        typeof window.StoryBoxBuilder[tickFunctionRight] === "function"
      ) {
        window.StoryBoxBuilder.rightControllerTickEvent =
          window.StoryBoxBuilder[tickFunctionRight];
      } else {
        window.StoryBoxBuilder.rightControllerTickEvent = null;
      }
    }

    window.StoryBoxBuilder.modelLoadedEvent = this.modelLoadedEvent;
  }

  render(target) {
    this.storySettings.target = target;
  }
}

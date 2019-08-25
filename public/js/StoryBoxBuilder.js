import { Gallery } from "./gallery.js";
import { vrlog } from "./vrlog.js";
import { testPositions } from "./testPositions.js";
import modelLoadedEvent  from './modelUpdates.js';

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
          el.addEventListener(
            "ybuttondown",
            window.StoryBoxBuilder.yButtonEvent
          );
        },
        update: function() {
          var el = this.el;
          el.addEventListener(
            "ybuttondown",
            window.StoryBoxBuilder.yButtonEvent
          );
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

    if (AFRAME.components["gltf-material"] === undefined) {
      AFRAME.registerComponent('gltf-material', {
          schema: {
            path: {default: ''},
            normalPath: {default: null},
            bumpPath: {default: null},
            alphaPath: {default: null},
            displacementPath: {default: null},
            roughnessPath: {default: null},
            environmentPath: {default: null},
            emissivePath: {default: null},
            lightMapPath: {default: null},
            ambientOcculsionPath: {default: null},
            opacity: {default: null},
            extension: {default: 'jpg'},
            format: {default: 'RGBFormat'},
            enableBackground: {default: false}
          },
          multiple: true,
          init: function() {
            const data = this.data;
            var el = this.el;

            let materialSettings = {};
            // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial

            let scale = {
              u: 8,
              v: 8
            }

            materialSettings.metalness = 0;
            if (data.opacity !== null) {
              materialSettings.opacity = typeof data.opacity === 'string' ? parseFloat(data.opacity) : data.opacity;
            }

            if (data.path !== null && data.path !== '') {
              console.log("texture path: ", data.path);
              var baseTexture = new THREE.TextureLoader().load(data.path);
              baseTexture.wrapS = THREE.RepeatWrapping;
              baseTexture.wrapT = THREE.RepeatWrapping;
              baseTexture.repeat.set(scale.u, scale.v);
              materialSettings.map = baseTexture;
            }

            if (data.normalPath !== null) {
              var normalPathTexture = new THREE.TextureLoader().load(data.normalPath);
              normalPathTexture.wrapS = THREE.RepeatWrapping;
              normalPathTexture.wrapT = THREE.RepeatWrapping;
              normalPathTexture.repeat.set(scale.u, scale.v);
              materialSettings.normalMap = normalPathTexture;
            }

            if (data.bumpPath !== null) {
              var bumpTexture = new THREE.TextureLoader().load(data.bumpPath);
              bumpTexture.wrapS = THREE.RepeatWrapping;
              bumpTexture.wrapT = THREE.RepeatWrapping;
              bumpTexture.repeat.set(scale.u, scale.v);
              materialSettings.bumpMap = bumpTexture;
              materialSettings.bumpScale = 0.5;
            }

            if (data.alphaPath !== null) {
              var alphaTexture = new THREE.TextureLoader().load(data.alphaPath);
              alphaTexture.wrapS = THREE.RepeatWrapping;
              alphaTexture.wrapT = THREE.RepeatWrapping;
              alphaTexture.repeat.set(scale.u, scale.v);
              materialSettings.alphaMap = alphaTexture;
            }

            if (data.displacementPath !== null) {
              var displacementTexture = new THREE.TextureLoader().load(data.displacementPath);
              displacementTexture.wrapS = THREE.RepeatWrapping;
              displacementTexture.wrapT = THREE.RepeatWrapping;
              displacementTexture.repeat.set(scale.u, scale.v);
              materialSettings.displacementMap = displacementTexture;
              // materialSettings.displacementScale = 0.5;
            }

            if (data.environmentPath !== null) {
              var environmentTexture = new THREE.TextureLoader().load(data.environmentPath);
              environmentTexture.wrapS = THREE.RepeatWrapping;
              environmentTexture.wrapT = THREE.RepeatWrapping;
              environmentTexture.repeat.set(scale.u, scale.v);
              materialSettings.envMap = environmentTexture;
              // materialSettings.envMapIntensity = 2;
            }

            if (data.emissivePath !== null) {
              var emissiveTexture = new THREE.TextureLoader().load(data.emissivePath);
              emissiveTexture.wrapS = THREE.RepeatWrapping;
              emissiveTexture.wrapT = THREE.RepeatWrapping;
              emissiveTexture.repeat.set(scale.u, scale.v);
              materialSettings.emissiveMap = emissiveTexture;
            }

            if (data.ambientOcculsionPath !== null) {
              var ambientOcculsionTexture = new THREE.TextureLoader().load(data.ambientOcculsionPath);
              materialSettings.aoMap = ambientOcculsionTexture;
              materialSettings.aoMapIntensity = 0.1;
            }
            //
            if (data.roughnessPath !== null) {
              var roughnessTexture = new THREE.TextureLoader().load(data.roughnessPath);
              roughnessTexture.wrapS = THREE.RepeatWrapping;
              roughnessTexture.wrapT = THREE.RepeatWrapping;
              roughnessTexture.repeat.set(scale.u, scale.v);
              materialSettings.roughnessMap = roughnessTexture;
            }

            if (data.lightMapPath !== null) {
              var lightMapTexture = new THREE.TextureLoader().load(data.lightMapPath);
              materialSettings.lightMap = lightMapTexture;
            }

            // materialSettings.emissive = #ffffff;
            // materialSettings.emissiveIntensity = 0.3;
            this.material = new THREE.MeshStandardMaterial(materialSettings);

            this.el.addEventListener('model-loaded', () => {
              console.log('update model loaded');
              this.update()
            });
          },
          update: function() {
            let object;
            if (this.el !== undefined) {
              object = this.el.getObject3D('mesh');
              if (!object) return;
              object.traverse((node) => {
                if (node !== undefined && node.isMesh) {
                  node.material = this.material;
                }
              });
            }
          },
          remove: function () {
            var data = this.data;
            var el = this.el;

            // Remove event listener.
            if (data.event) {
              el.removeEventListener(data.event, this.eventHandlerFn);
            }
          }
        }
      );

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



    if (AFRAME.components["intersection-play"] === undefined) {
    AFRAME.registerComponent('intersection-play', {
      schema: {
        name: {default: 'intersection-play-element'},
        sceneTarget: {default: null},
        action: {default: null},
      },
      init: function() {
        console.log('intersection-play init', this.el);
        this.el.addEventListener('hit', (e) => {
          window.StoryBoxBuilder.hitEvent();

          // console.log('hit');
          // console.log(e);
          // vrlog('hit');
        });
        this.el.addEventListener('hitend', (e) => {
          console.log('hitend');
          // console.log(e);
          // vrlog('hitend');
        });
      },
      update: function() {
        console.log('intersection-play update', this.el.getAttribute('id'));
        // var data = this.data;
        // var el = this.el;
        //
        // // Remove event listener.
        // if (data.event) {
        //   el.removeEventListener(data.event, this.eventHandlerFn);
        // }
        // this.el.addEventListener('hit', (e) => {
        //   console.log('hit');
        //   console.log(e);
        // });
        // this.el.addEventListener('hitend', (e) => {
        //   console.log('hitend')
        //   console.log(e)
        // });
      },
      // remove: function() {
      //   console.log('remove intersection-play');
      //   var data = this.data;
      //   var el = this.el;
      //
      //   // Remove event listener.
      //   if (data.event) {
      //     el.removeEventListener(data.event, this.eventHandlerFn);
      //   }
      // },

    });
  }

    if (AFRAME.components["left-controller-listener"] === undefined) {
      AFRAME.registerComponent("left-controller-listener", {
        init: function() {
          var el = this.el;
          if (
            typeof window.StoryBoxBuilder.leftControllerTickEvent === "function"
          ) {
            // vrlog(window.StoryBoxBuilder.leftControllerTickEvent);
            window.StoryBoxBuilder.leftControllerTickEvent();
          }
        },
        tick: function() {
          if (
            typeof window.StoryBoxBuilder.leftControllerTickEvent === "function"
          ) {
            vrlog(window.StoryBoxBuilder.leftControllerTickEvent);
            window.StoryBoxBuilder.leftControllerTickEvent();
          }
        }
      });
    }

    if (AFRAME.components["right-controller-listener"] === undefined) {
      AFRAME.registerComponent("right-controller-listener", {
        init: function() {
          var el = this.el;
          if (
            typeof window.StoryBoxBuilder.rightControllerTickEvent ===
            "function"
          ) {
            // vrlog(typeof window.StoryBoxBuilder.rightControllerTickEvent);
            window.StoryBoxBuilder.rightControllerTickEvent();
          }
        },
        tick: function() {
          if (
            typeof window.StoryBoxBuilder.rightControllerTickEvent ===
            "function"
          ) {
            // vrlog(typeof window.StoryBoxBuilder.rightControllerTickEvent);
            window.StoryBoxBuilder.rightControllerTickEvent();
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
        this.setupAppButtons();
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

    if (document.getElementById("leftHand") !== null) {
      let tickFunctionLeft = document
        .getElementById("leftHand")
        .getAttribute("tickFunction");

      if (
        tickFunctionLeft !== undefined &&
        window.StoryBoxBuilder[tickFunctionLeft] !== undefined &&
        typeof window.StoryBoxBuilder[tickFunctionLeft] === "function"
      ) {
        window.StoryBoxBuilder.leftControllerTickEvent = window.StoryBoxBuilder[tickFunctionLeft];

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

    if (document.getElementById("rig") !== null) {
      let tickFunctionRig = document
        .getElementById("rig")
        .getAttribute("updateTestPosition");
      if (
        tickFunctionRig !== undefined &&
        window.StoryBoxBuilder[tickFunctionRig] !== undefined &&
        typeof window.StoryBoxBuilder[tickFunctionRig] === "function"
      ) {
        window.StoryBoxBuilder.rigControllerTickEvent =
          window.StoryBoxBuilder[tickFunctionRig];
      } else {
        window.StoryBoxBuilder.rigControllerTickEvent = null;
      }
    }

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

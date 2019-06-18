import { registry } from "./../examples/gallery/registry.js";

import { Scene as gallerySceneJson } from "./../examples/gallery/gallery.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import { Gallery } from "./gallery.js";

export class StoryBoxBuilder {
  constructor() {
    this.storySettings = {};
    this.storySettings.timer = null;
    // this.storySettings.stretchLine = null;
    this.storySettings.target = null;
    this.storySettings.transition = null;
    this.storySettings.galleryListeners = false;
    this.assetMarkup = ``;
    this.assetMarkupGallery = ``;
    this.showLoading = false;
    this.registry = [];
    this.storySettings.currentStory = 'gallery';
    this.registryLocal = registry;
    // @TODO this will eventually be url param to make the viewer play any json file w/ example
    this.dropboxRegistry = this.loadDropbox([
      'https://www.dropbox.com/s/anftsg0se49msqz/dropbox-tincture-sea.json?dl=0'
    ]);
    this.logQueue = [];
  }

  formatDropboxRawLinks(url)  {
    // This is the path to downloadable dropbox assets. Cannot have dl=0 & must be the user content URL.
    // This allows for simple hosting for low traffic assets. Higher traffic assets would need to be hosted elsewhere.
    return url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');
  }

  loadDropbox(files) {
    let dropboxRegistry = files.forEach(file => {
    let rawFilePath = this.formatDropboxRawLinks(file);
    let filesData = fetch(rawFilePath)
    .then(response => response.json())
    .then((data) => {
      this.registry = this.registryLocal;
      this.registry.push(data);

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
        this.setupGallery();
      });
    });
  }

  setupGallery() {
    window.Gallery = new Gallery();
    let storyboxAframe = new StoryboxAframe();
    window.StoryboxAframe = storyboxAframe;
    let rebuildAssets = true;
    if (this.assetMarkupGallery !== ``) {
      rebuildAssets = false;
    }

    let gallery = window.Gallery.render(this.registry);
    clearTimeout(this.storySettings.timer);
    // clearInterval(this.storySettings.stretchLine);

    if (typeof gallery.assetsElements !== 'string' && gallery.assetsElements.length > 0 && rebuildAssets === true) {
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
    if (typeof sceneMarkup.assetsElements !== 'string' && sceneMarkup.assetsElements.length > 0 && rebuildAssets === true) {
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

    if (document.querySelector('a-assets') !== undefined && document.querySelector('a-assets') !== null) {
      document.querySelector('a-assets').remove();
    }
    if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
      var assets = document.createElement("a-assets");
      assets.setAttribute("timeout", 60000);
      document.getElementById("scenes").before(assets);
    }
    document.querySelector("a-assets").innerHTML = this.assetMarkupGallery;

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
      sceneSelectorEl.setAttribute('scene-selector-listener', '');
      document.getElementById("scenes").append(sceneSelectorEl);
    }
    sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '') {
      // Set the scene.
      this.updateTemplate(sceneSelector, "gallery");
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

    let storyboxAframe = new StoryboxAframe();
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);

    let rebuildAssets = true;
    // if (this.assetMarkup !== ``) {
    //   rebuildAssets = false;
    // }
    // Read all scenes in the story & convert JSON to aframe tags.
    currentStory.scenes.map(sceneJson => {
      // Get markup chunks for aframe
      let sceneMarkup = storyboxAframe.render(sceneJson);

      if (typeof sceneMarkup.assetItemElements !== 'string' && sceneMarkup.assetItemElements.length > 0 && rebuildAssets) {
        // Load all scene assets
        sceneMarkup.assetItemElements.map(asset => {
          this.assetMarkup += asset;
        });
      }

      if (typeof sceneMarkup.assetsElements !== 'string' && sceneMarkup.assetsElements.length > 0 && rebuildAssets) {
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
    if (document.querySelector('a-assets') !== undefined && document.querySelector('a-assets') !== null) {
      document.querySelector('a-assets').remove();
    }
    if (document.querySelector('a-assets') === undefined || document.querySelector('a-assets') === null) {
      var assets = document.createElement("a-assets");
      assets.setAttribute("timeout", 60000);
      document.getElementById("scenes").before(assets);
    }
    document.querySelector("a-assets").innerHTML = this.assetMarkup;

    this.update();

    document.querySelector("a-assets").addEventListener('loaded', () => {
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
    let animation = document.querySelector('.glb-animation');
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
      sceneSelectorEl.setAttribute('scene-selector-listener', '');
      document.getElementById("scenes").append(sceneSelectorEl);
    }

    sceneSelector = document.getElementById("scene-selector");
    if (sceneSelector !== undefined && sceneSelector !== null && sceneSelector !== '' && currentScene !== undefined && currentScene !== null) {
      // Set the scene.
      this.updateTemplate(sceneSelector, currentScene.id);
    }
  }

  xButtonEvent(evt) {
    window.StoryBoxBuilder.loadGallery();
  }

  leftControllerTickEvent() {
    window.StoryBoxBuilder.updateStretchLine();
  }

  rightControllerTickEvent() {
    window.StoryBoxBuilder.updateStretchLine();
  }

  debugControllButtonTrigger(button) {
    switch (button) {
      case 'X':
        document.getElementById('leftHand').dispatchEvent(new CustomEvent("xbuttondown"));
        break;
      case 'Y':
        document.getElementById('leftHand').dispatchEvent(new CustomEvent("ybuttondown"));
        break;
      case 'A':
        document.getElementById('leftHand').dispatchEvent(new CustomEvent("abuttondown"));
        break;
      case 'B':
        document.getElementById('leftHand').dispatchEvent(new CustomEvent("bbuttondown"));
        break;
    }
  }

  setupAppButtons() {
    if (AFRAME.components['x-button-listener'] === undefined) {
      AFRAME.registerComponent('x-button-listener', {
        init: function () {
          var el = this.el;
          el.addEventListener('xbuttondown', window.StoryBoxBuilder.xButtonEvent);
        },
        update: function () {
          var el = this.el;
          el.addEventListener('xbuttondown', window.StoryBoxBuilder.xButtonEvent);
        },
      });
    }

    if (AFRAME.components['y-button-listener'] === undefined) {
      AFRAME.registerComponent('y-button-listener', {
        init: function () {
          var el = this.el;
          el.addEventListener('ybuttondown', function (evt) {
            this.vrlog('Y');
          });
        },
      });
    }

    if (AFRAME.components['a-button-listener'] === undefined) {
      AFRAME.registerComponent('a-button-listener', {
        init: function () {
          var el = this.el;
          el.addEventListener('abuttondown', function (evt) {
            this.vrlog('A');
          });
        },
      });
    }

    if (AFRAME.components['b-button-listener'] === undefined) {
      AFRAME.registerComponent('b-button-listener', {
        init: function () {
          var el = this.el;
          el.addEventListener('bbuttondown', function (evt) {
            this.vrlog('B');
          });
        },
      });
    }

    if (AFRAME.components['left-controller-listener'] === undefined) {
      AFRAME.registerComponent('left-controller-listener', {
        init: function () {
          var el = this.el;
        },
        tick: function() {
          window.StoryBoxBuilder.leftControllerTickEvent();
        }
      });
    }

    if (AFRAME.components['right-controller-listener'] === undefined) {
      AFRAME.registerComponent('right-controller-listener', {
        init: function () {
          var el = this.el;
        },
        tick: window.StoryBoxBuilder.rightControllerTickEvent,
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyX") {
        this.vrlog('X');
        this.loadGallery();
      }

      if (e.code === "KeyY") {
        this.vrlog('Y');
        this.loadGallery();
      }

      if (e.code === "KeyA") {
        this.vrlog('B');
        this.loadGallery();
      }

      if (e.code === "KeyP") {
        this.updateStretchLine();
      }
    });
  }

  sceneSelectorUpdateEvent() {
    let currentStory = this.getCurrentStory(this.storySettings.currentStory);
    if (currentStory !== undefined && currentStory !== null && currentStory.name !== undefined) {
      this.vrlog(currentStory.name + ' Loaded.');
    }
  }

  updateStretchLine() {
    var stretchLeft = document.querySelector("#leftStretch");
    var stretchRight = document.querySelector("#rightStretch");
    var leftHand = document.querySelector("#leftHand");
    var rightHand = document.querySelector("#rightHand");
    if (stretchLeft !== null && stretchRight !== null && stretchLeft.object3D !== undefined) {
      let positionLeft = stretchLeft.object3D.position;
      let positionRight = stretchRight.object3D.position;
      let positionLeftHand = leftHand.object3D.position;
      let positionRightHand = rightHand.object3D.position;

      let newPositionLeft, newPositionRight;

      if (!AFRAME.utils.device.checkHeadsetConnected()) {
        newPositionLeft = {
          x: positionLeft.x - 0.01,
          y: positionLeft.y,
          z: positionLeft.z,
        };
        newPositionRight = {
          x: positionRight.x + 0.01,
          y: positionRight.y,
          z: positionRight.z,
        };
        stretchLeft.setAttribute('position', newPositionLeft);
        stretchRight.setAttribute('position', newPositionRight);
      } else {
        newPositionLeft = {
          x: positionLeftHand.x,
          y: positionLeftHand.y,
          z: positionLeftHand.z,
        };
        newPositionRight = {
          x: positionRightHand.x,
          y: positionRightHand.y,
          z: positionRightHand.z,
        };
      }

      var stretch = document.querySelector("#rose-stretch");

      if (stretch !== null) {
        let line = stretch.getAttribute('line');
        let lineParsed = AFRAME.utils.styleParser.parse(line);
        lineParsed.start = newPositionLeft;
        lineParsed.end = newPositionRight;
        stretch.setAttribute('line', lineParsed);
      }

      var stretchObjects = document.querySelectorAll('.stretch-object');
      let positionObj;
      if (stretchObjects !== null && stretchObjects.length > 0) {
        stretchObjects.forEach(obj => {
          let id = obj.getAttribute('id');
          let el = document.getElementById(id);
          positionObj = window.StoryboxAframe.updateStretchPosition(newPositionLeft, newPositionRight, el);
          let newPositionObj = {
            x: positionObj.x !== Infinity ? positionObj.x : 0,
            y: positionObj.y !== Infinity ? positionObj.y - 0.5 : -0.5,
            z: positionObj.z !== Infinity ? positionObj.z - 0.5 : -0.5,
          }
          let propPosition = el.getAttribute('position');
          el.setAttribute('position', newPositionObj);
        });
      }
    }
  }

  vrlog(message) {
    var logVR = document.getElementById('debugger-log-vr');

    if (logVR !== undefined && logVR !== null) {
      try {
        let text = logVR.getAttribute('text');
        let textParsed = AFRAME.utils.styleParser.parse(text);
        if (textParsed !== undefined) {
          if (typeof message === 'object') {
            message = JSON.stringify(message);
          }
          message =  `${message} \n`;
          textParsed.value = `${textParsed.value}${message}`;
          if (typeof textParsed === 'object') {
            let logs =  textParsed.value.split('\n');
            let tailLogs = logs;
            if (logs.length > 3) {
              tailLogs = logs.slice(Math.max(logs.length - 6), logs.length);
            }
            let logString = tailLogs.join('\n');
            textParsed.value = logString;
            logVR.setAttribute('text', textParsed);
          }
        }
      } catch(err) {
        this.vrlog(err);
      }
    } else {
      this.logQueue.push(message);
    }
  }

  sceneSelectorEventListeners(e) {
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
                5000
              );
            }
            else {
              el.setAttribute('data-clicked', 'false');
            }
          break;
        }
      }

      // Click gallery item to load a story.
      if (e.detail !== undefined && e.detail.intersectedEl !== undefined) {
        let el = e.detail.intersectedEl;
        if (el.getAttribute('class') === 'clickable-tile') {
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
  }

  aframeMutations() {
    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
          if (mutation.target.id === 'debugger-log-vr-bkg') {
            // update all logs
            this.logQueue.forEach(message => {
              this.vrlog(message);
            });
            this.logQueue = [];
          }
          if (mutation.target.id === 'scene-selector') {
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

  updateEventListeners() {
    // Reset debugger message throttler.
    window.debugCounter = 0;

    if (this.storySettings.galleryListeners === false) {
      document.querySelector('#scene-selector').addEventListener("click", (e) => this.sceneSelectorEventListeners(e));
    }
    this.storySettings.galleryListeners = true;
    // // @TODO make a more generic name for stretcher.
    // if (document.getElementById('rose-stretch') !== undefined && document.getElementById('rose-stretch') !== null) {
    //   clearInterval(this.storySettings.stretchLine);
    //   this.storySettings.stretchLine = null;
    //   this.storySettings.stretchLine = window.setInterval(function() {
    //     this.updateStretchLine();
    //   }.bind(this), 100);
    //   this.vrlog('Loading stretch interface');
    // } else {
    //   clearInterval(this.storySettings.stretchLine);
    //   this.storySettings.stretchLine = null;
    // }

    // Set globally readable event names
    window.StoryBoxBuilder.xButtonEvent = this.xButtonEvent;
    window.StoryBoxBuilder.leftControllerTickEvent = this.leftControllerTickEvent;
    window.StoryBoxBuilder.rightControllerTickEvent = this.rightControllerTickEvent;
  }

  render(target) {
    this.storySettings.target = target;
  }
}

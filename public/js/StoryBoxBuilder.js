import { registry } from "./../examples/gallery/registry.js";

import { Scene as gallerySceneJson } from "./../examples/gallery/gallery.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import { Gallery } from "./gallery.js";

export class StoryBoxBuilder {
  constructor() {
    this.storySettings = {};
    this.storySettings.timer = null;
    this.storySettings.stretchLine = null;
    this.storySettings.target = null;
    this.storySettings.transition = null;
    this.storySettings.galleryListeners = false;
    this.assetMarkup = ``;
    this.assetMarkupGallery = ``;
    this.showLoading = false;
    this.registry = [];
    this.storySettings.currentStory = 'gallery';
    this.registryLocal = registry;
    this.dropboxRegistry = this.loadDropbox([
      'https://www.dropbox.com/s/anftsg0se49msqz/dropbox-tincture-sea.json?dl=0'
    ]);
    this.logQueue = [];
  }

  loadDropbox(files) {
    // await https://www.dropbox.com/s/anftsg0se49msqz/dropbox-tincture-sea.js?dl=0
    let dropboxRegistry = files.forEach(file => {
    let rawFilePath = file.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');
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
    let buildAssets = true;
    if (this.assetMarkupGallery !== ``) {
      buildAssets = false;
    }

    this.vrlog('gall');
    let gallery = window.Gallery.render(this.registry);
    clearTimeout(this.storySettings.timer);
    clearInterval(this.storySettings.stretchLine);

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
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
    this.storySettings.stretchLine = null
    // this.storySettings.target = null;
    // this.showLoading = true;
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
    clearInterval(this.storySettings.stretchLine);
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
          this.vrlog('X');
          this.loadGallery();
        });
      },
    });

    AFRAME.registerComponent('y-button-listener', {
      init: function () {
        var el = this.el;
        el.addEventListener('ybuttondown', function (evt) {
          this.vrlog('Y');
        });
      },
    });

    AFRAME.registerComponent('a-button-listener', {
      init: function () {
        var el = this.el;
        el.addEventListener('abuttondown', function (evt) {
          this.vrlog('A');
        });
      },
    });

    AFRAME.registerComponent('b-button-listener', {
      init: function () {
        var el = this.el;
        el.addEventListener('bbuttondown', function (evt) {
          this.vrlog('B');

        });
      },
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyX") {
        this.vrlog('X');
        this.loadGallery();
      }

      if (e.code === "KeyP") {
        this.updateStretchLine()
      }
    });
  }

  updateStretchLine() {
    var stretchLeft = document.querySelector("#leftStretch");
    var stretchRight = document.querySelector("#rightStretch");
    if (stretchLeft !== null && stretchRight !== null && stretchLeft.object3D !== undefined) {
      let positionLeft = stretchLeft.object3D.position;
      let positionRight = stretchRight.object3D.position;

      if (!AFRAME.utils.device.checkHeadsetConnected()) {
        let newPositionLeft = {
          x: positionLeft.x - 0.01,
          y: positionLeft.y,
          z: positionLeft.z,
        };
        let newPositionRight = {
          x: positionRight.x + 0.01 ,
          y: positionRight.y,
          z: positionRight.z,
        };
        stretchLeft.setAttribute('position', newPositionLeft);
        stretchRight.setAttribute('position', newPositionRight);
      }

      var stretch = document.querySelector("#rose-stretch");
      if (stretch !== null) {
        let line = stretch.getAttribute('line');
        let lineParsed = AFRAME.utils.styleParser.parse(line);
        lineParsed.start = positionLeft;
        lineParsed.end = positionRight;
        stretch.setAttribute('line', lineParsed);


        // TEST
        // el.geometry.computeBoundingBox();
        // var boundingBox = el.geometry.boundingBox;
        // var position = new THREE.Vector3();
        // position.subVectors( boundingBox.max, boundingBox.min );
        // position.multiplyScalar( 0.5 );
        // position.add( boundingBox.min );
        // position.applyMatrix4( el.matrixWorld );
      }

      var stretchObjects = document.querySelectorAll('.stretch-object');
      let positionObj;
      if (stretchObjects !== null && stretchObjects.length > 0) {
        stretchObjects.forEach(obj => {
          let id = obj.getAttribute('id');
          let el = document.getElementById(id);
          positionObj = window.StoryboxAframe.updateStretchPosition(stretchLeft.getAttribute('position'), stretchRight.getAttribute('position'), el);
          let newPositionObj = {
            x: positionObj.x,
            y: positionObj.y,
            z: positionObj.z,
          }
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
          textParsed.value = `${textParsed.value}${message}`;
          if (typeof textParsed === 'object') {
            textParsed.value = textParsed.value.substr(textParsed.value.length - 200) + '\n';
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
            console.log('panel rendered');
            // update all logs
            this.logQueue.forEach(message => {
              this.vrlog(message);
            });
            this.logQueue = [];
          }
          this.updateEventListeners();
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
    if (document.getElementById('rose-stretch') !== undefined && document.getElementById('rose-stretch') !== null) {
      clearInterval(this.storySettings.stretchLine);
      this.storySettings.stretchLine = null;
      this.storySettings.stretchLine = window.setInterval(function() {
        this.updateStretchLine();
      }.bind(this), 100);
      this.vrlog('Loading stretch interface');
    } else {
      clearInterval(this.storySettings.stretchLine);
      this.storySettings.stretchLine = null;
    }
  }

  render(target) {
    this.storySettings.target = target;
  }
}

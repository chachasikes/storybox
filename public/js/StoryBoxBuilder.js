import { registry } from "./../examples/gallery/registry.js";

import { Scene as gallerySceneJson } from "./../examples/gallery/gallery.js";
import { StoryboxAframe } from "./StoryboxAframe.js";
import { Gallery } from "./gallery.js";

export class StoryBoxBuilder {
  constructor() {
    this.storySettings = {};
    this.storySettings.timer = null;
    this.storySettings.target = null;
    this.storySettings.transition = null;
    this.assetMarkup = ``;
    this.assetMarkupGallery = ``;
    this.showLoading = false;
    this.registry = [];
    this.storySettings.currentStory = 'gallery';
    this.registryLocal = registry;
    this.dropboxRegistry = this.loadDropbox([
      'https://www.dropbox.com/s/anftsg0se49msqz/dropbox-tincture-sea.json?dl=0'
    ]);
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
    this.setupGallery();
  }

  // Update the selected story
  galleryItemSelect(id) {
    this.storySettings.currentStory = id;
    this.storySettings.timer = null;
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
    this.playGLBAnimation();
  }

  playGLBAnimation() {
    console.log("playing gltf animation");
    let animation = document.querySelector('.glb-animation');
    console.log('animation', animation);
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

  initPhysics() {
    var rope = document.getElementById('rose-stretch');
    let pointA = document.getElementById('leftPole');
    let pointB = document.getElementById('rightPole');

    // let aPosition = pointA.object3D.position.clone();
    // let bPosition = pointB.object3D.position.clone();
    // let aDimensions = pointA.object3D.position;
    // let bDimensions = pointB.object3D.position;
    if (rope !== null) {

      var physicsWorld;
      var container, stats;
      var camera, controls, scene, renderer;
      var textureLoader;
      var clock = new THREE.Clock();
      // Physics variables
      var gravityConstant = - 9.8;
      var collisionConfiguration;
      var dispatcher;
      var broadphase;
      var solver;
      var softBodySolver;
      var physicsWorld;
      var rigidBodies = [];
      var margin = 0.05;
      var hinge;
      var transformAux1;
      var armMovement = 0;

      collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
      dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
      broadphase = new Ammo.btDbvtBroadphase();
      solver = new Ammo.btSequentialImpulseConstraintSolver();
      softBodySolver = new Ammo.btDefaultSoftBodySolver();
      physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
      physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
      physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
      transformAux1 = new Ammo.btTransform();

      var ropeNumSegments = 20;
      var ropeLength = 200;
      var ropeMass = 10;
      var segmentLength = ropeLength / ropeNumSegments;
			var ropeGeometry = new THREE.BufferGeometry();
			var ropeMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 });
			var ropePositions = [];
			var ropeIndices = [];

      // var ropePositionA = pointA.object3D.position;
      // var ropePositionB = pointB.object3D.position;

      var ropePositionA = {x: -50, y: 100, z: -1};
      var ropePositionB = {x: 50, y: 100, z: -4};

			for ( var i = 0; i < ropeNumSegments + 1; i ++ ) {
				ropePositions.push( ropePositionA.x + i  * segmentLength, ropePositionA.y + 1, ropePositionA.z + 1 );
			}

			for ( var i = 0; i < ropeNumSegments; i ++ ) {
				ropeIndices.push( i , i + 1 );
			}

			ropeGeometry.setIndex( new THREE.BufferAttribute( new Uint16Array( ropeIndices ), 1 ) );
			ropeGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ropePositions ), 3 ) );
			ropeGeometry.computeBoundingSphere();
			var ropeLineSegments = new THREE.LineSegments(ropeGeometry, ropeMaterial);
			ropeLineSegments.castShadow = true;
			ropeLineSegments.receiveShadow = true;

      // view-source:https://threejs.org/examples/webgl_physics_rope.html
      var softBodyHelpers = new Ammo.btSoftBodyHelpers();
      // console.log("post", ropePositionA, ropePositionB);
      var ropeStart = new Ammo.btVector3( ropePositionA.x, ropePositionA.y, ropePositionA.z );
      var ropeEnd = new Ammo.btVector3( ropePositionB.x, ropePositionB.y, ropePositionB.z);
      var ropeSoftBody = softBodyHelpers.CreateRope( physicsWorld.getWorldInfo(), ropeStart, ropeEnd, ropeNumSegments - 1, 0 );
      var sbConfig = ropeSoftBody.get_m_cfg();
      sbConfig.set_viterations( 10 );
      sbConfig.set_piterations( 10 );
      ropeSoftBody.setTotalMass( ropeMass, false );
      Ammo.castObject( ropeSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
      physicsWorld.addSoftBody( ropeSoftBody, 1, - 1 );

      console.log(physicsWorld);

      // Disable deactivation
      ropeSoftBody.setActivationState( 4 );
      rope.setObject3D('line', ropeLineSegments);
      rope.object3D.userData.physicsBody = ropeSoftBody;


      // var armMass = 2;
			// var armLength = 3;
			// var pylonHeight = ropePos.y + ropeLength;
			// var baseMaterial = new THREE.MeshPhongMaterial( { color: 0x606060 } );
			// pos.set( ropePos.x, 0.1, ropePos.z - armLength );
			// quat.set( 0, 0, 0, 1 );
			// var base = createParalellepiped( 1, 0.2, 1, 0, pos, quat, baseMaterial );
			// base.castShadow = true;
			// base.receiveShadow = true;
			// pos.set( ropePos.x, 0.5 * pylonHeight, ropePos.z - armLength );
			// var pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
			// pylon.castShadow = true;
			// pylon.receiveShadow = true;
			// pos.set( ropePos.x, pylonHeight + 0.2, ropePos.z - 0.5 * armLength );
			// var arm = createParalellepiped( 0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial );
			// arm.castShadow = true;
			// arm.receiveShadow = true;

			// Glue the rope extremes to the ball and the arm
			var influence = 1;
			ropeSoftBody.appendAnchor( 0, pointA.object3D.userData.physicsBody, true, influence );
			ropeSoftBody.appendAnchor( ropeNumSegments, pointB.object3D.userData.physicsBody, true, influence );

			// Hinge constraint to move the arm
			// var pivotA = new Ammo.btVector3( 0, pylonHeight * 0.5, 0 );
			// var pivotB = new Ammo.btVector3( 0, - 0.2, - armLength * 0.5 );
			// var axis = new Ammo.btVector3( 0, 1, 0 );
			// hinge = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true );
			// physicsWorld.addConstraint( hinge, true );

    }
  }

  buildLineRope() {
    var rope = document.getElementById('rose-stretch');
    let pointA = document.getElementById('leftPole');
    let pointB = document.getElementById('rightPole');
    if (rope !== null && pointA !== null && pointB !== null && typeof Ammo === 'function') {
      Ammo().then( function( AmmoLib ) {
        console.log(AmmoLib, 'test');
      	Ammo = AmmoLib;
        this.initPhysics()
      }.bind(this) );
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
    this.buildLineRope();
  }

  render(target) {
    this.storySettings.target = target;
  }
}

# Storybox
Immersive Story Player

Create immersive stories for virtual and augmented reality.

https://github.com/chachasikes/storybox


## About
This story player allows you to combine 3D assets into scenes, and navigate through the scenes in WebXR.
Useful for anyone creating immersive paintings with Tiltbrush or the Quill App

* Uses a draft of an XR interactive "data standard" described and implemented for in the Blox project (https://github.com/anselm/blox), which is an interface to ThreeJS.
* Provides a JSON interface to A-frame WebVR content. Mozilla's AFrame is an interface for the WebVR Javascript library, ThreeJS.
* Can load assets from Dropbox files or other web-based locations
* Loads and plays Tiltbrush and animated Quill App files (when converted Alembic to GLTF (with Sketchfab or other converted) to GLB files, and file sizes under 50MB, best with wifi)
* Support the common features needed to create storyboards, VR mockups and animatics, such as:
  * Putting scene files in sequence
  * Voiceover, audio files, spatialized audio loops & dialogue
  * Text panels for dialogue & descriptions
  * Play scene or animation when: gazed up, clicked, near, or after a certain amount of time
  * Loading screens, asset management, file size warnings, titles & automatic credits
* Put objects on avatars head (masks) and in hands (props)

This tool will be used to prototype a series of immersive storyboards as well as VR & Scent experiments. Features are planned accordingly.

## Immersive Storyboarding
https://github.com/chachasikes/immersive-storyboarding/blob/master/INTRO.md

## Planned Features

### As of May 29, 2019
* Support WebXR (can play content in VR, Mobile AR, HoloLens, or on desktop)
* Work on Oculus Quest, Rift, Google Cardboard and Firefox with WebVR features enabled (other support depending on access to equipment for testing)
* Use JSON to help draft and test a data standard for immersive interactives (such as Blox)
* Triggers: gaze, touch, proximity, geo-pin
* Where possible, make asset import for Tiltbrush, Google Poly, Quill App, Dropbox, and hand-made skyboxes as easy as possible (GLB, GLTF, FBX, OBJ, PNG, JPG, MPG, OGG, WAV, equirectangular, cubemap, vstrip, Fountain dialogue & screen directions) - and appropriate non-shader lights for rendering Quill art correctly.
* Experiment with using QR patterns to connect real-world props with QR coded virtual props.
* Gallery project menu
* Support of Glitch remixes (requires keeping git repo size small to allow replication, so history of project will be periodically removed)
* Extruded SVG files
* Interface elements & functions for play, pause, back, next, stop, restart, etc.

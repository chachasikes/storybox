# Storybox
Immersive Story Player
Create immersive stories for virtual and augmented reality.
https://github.com/chachasikes/storybox

## About
This story player allows you to combine 3D assets into scenes, and navigate through the scenes in WebXR.
Useful for anyone creating immersive paintings with Tiltbrush or the Quill App

* Uses a draft of an XR interactive "data standard" described and implemented for in the Blox project (https://github.com/anselm/blox), which is an interface to ThreeJS.
* Provides a JSON interface to A-Frame WebVR content. Mozilla's A-Frame (https://aframe.io/) is an interface for the Javascript 3d library, ThreeJS (https://threejs.org/). Uses A-Frame's WebXR implementation, which works well for development and testing.
* Can load assets from Dropbox files or other web-based locations
* Loads and plays Tiltbrush (https://www.tiltbrush.com/) and animated Quill app (https://quill.fb.com/) files (Alembic to GLB), with file sizes under 50MB for better performance)
* Support the common features needed to create immersive storyboards, VR mockups, walkthroughs and animatics, such as:
  * Putting scene files in navigable sequence
  * Voiceover, scratch audio, spatialized audio loops & dialogue, sound effects and other ambient sound.
  * Text panels for dialogue, descriptions and prompts
  * Play scene or animation when: gazed up, clicked, near, or after a certain amount of time
  * Loading screens, asset management, file size warnings, titles & automatic credits
  * Put objects on avatars head (masks) and in hands (props)

This tool will be used to prototype a series of immersive storyboards as well as VR & Scent experiments. Features are planned accordingly.

## Immersive Storyboarding
https://github.com/chachasikes/immersive-storyboarding/blob/master/INTRO.md

## Planned Features

As of May 29, 2019

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

### Glitch Urls

* https://chachasikes-storybox.glitch.me
* https://glitch.com/edit/#!/chachasikes-storybox
* https://glitch.com/~chachasikes-storybox

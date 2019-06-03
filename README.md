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


### Workflows

#### Tiltbrush (Oculus Quest) to FBX (static immersive illustration)
1. Draw asset in Tiltbrush
2. Save to Google Poly
3. Like your Google Poly asset
4. Go to Oculus Rift Tiltbrush
5. Load liked Google Poly image in Tiltbrush
6. Settings -> Labs -> Export FBX
7. Save FBX to Dropbox
8. Import FBX to Quill app in new 3d model layer

OR
9. Save to dropbox
10. Make dropbox link sharable
11. Copy link
12. Save mesh asset (link must be in format https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/not_real_file.fbx) - so remove the ?dl=0 at the end and change the domain, will eventually do this automatically.
@TODO, loader for fbx

#### Quill to GLB
1. Create asset (Oculus Rift)
2. Export to Alembic
3. Save .abc file somewhere you can find it again (such as Dropbox)
4. Upload to Sketchfab, make public & downloadable & published. Change lighting to "unlit" for quill files.
5. After a few minutes, download .GLTF
6. Paste \*.gltf and \*.bin https://glb-packer.glitch.me/
7. Rename resulting \*.glb file
8. Save to dropbox
9. Make dropbox link sharable
10. Copy link
11. Save mesh asset (link must be in format https://dl.dropboxusercontent.com/s/wh9s8aj56xxvdly/forest_rough_sketch.glb) - so remove the ?dl=0 at the end and change the domain, will eventually do this automatically. Tweak rotation, scale & position.

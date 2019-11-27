# Interaction with AFrame & WebXR

Game developers usually use Unity or Unreal Engine to build VR game experiences. This requires coding in C++ for interactions, and also requires a more involved publishing workflow which is a steep learning curve (and kind of annoying & slow.)

AFrame, by Mozilla, is a markup syntax for WebXR, and it makes building and mocking up experiences pretty quick & with a very light technology footprint - which also makes use of all aspects of the entire internet & is something that makes use of a popular coding language that a lot of people already know.

The web browsers in the VR headset can play the experiences, usually by selecting a “Goggles” button, it will open in full 3d in your headset. You can also browse these experiences from a web browser without a headset (though it will look much cooler in VR!)

There are limitations: file size, resources - but for what we are doing - simple animated shorts - we don’t need anything so complicated as a full on gaming engine.

## StoryBox
To build our scenes for this project, we are a using a framework that Chach developed (StoryBox) that makes it pretty easy to create & edit WebXR ready scenes in the laziest manner possible: a text editor & Dropbox. This framework is still in active development & will be used for the immersive animations we are making for the exhibition & hopefully as a tool for other VR artists, students and others interested in immersive storyboarding - or at the very least, to inform that medium overall.

## Note on Storyboarding
https://haroldandlillian.com/ This is a documentary on storyboarding created by documentary filmmaker Daniel Raim (& Jen Raim.) Highly recommend, it’s on Netflix.

Background Information
The idea for this method came from Chach’s friend Anselm Hook, who works as an AR Researcher at Mozilla & advisor to Sundance Labs.

They are experimenting with a better way to make experiences without needing to re-code literally everything all of the time - using some principles of data standards & the interoperability of the web.

Technical notes for any interactive developers
StoryBox is a Javascript based web framework that converts a simple text document into AFrame (which compiles to ThreeJS, which compiles to WebGL and displays in the HTML canvas element).

The experience can play in a WebVR compatible browser, such as Firefox. Some WebXR packages integrated with AFrame support use of headset features and touch controllers.

StoryBox is intended for making WebXR stories from VR paintings & integrating scent experiences with those stories. It is intended as a storyboarding & animatic creation tool, since visualizing sets and scents in VR requires some pre-visualization.

Since Chach is a writer interested in story development & rapid iteration of ideas, she needed this tool in order to quickly share ideas and immersive sketches over the web - even just to understand the immersive ideas at all. The ideal situation would be to easily text a friend a URL & they can open that URL in their Oculus Quest and take a peak at a scene composed of multiple sketches, and be taken through a journey of an idea & give feedback or collaborate.

These ideas can be continuously improved in a sort of “vertical pipeline” that incrementally makes the scene more fleshed out simply by updating linked files shared in Dropbox.

Anselm has a framework called Blox which abstracts the description of an interaction from the javascript library - allowing for different 3d javascript libraries to be used, or even to import the project and load it into Unity. The idea is that the JSON document stores all the information and metadata about the project, and could become a portable scene graph description format. They plan to compare JSON formats & devise a data standard spec at a later date.


StoryBox Features
StoryBox is the story player that registers a story on a menu, and provides a URL to access the immersive story in a WebVR compatible browser. Most of the features of AFrame are implemented & the framework handles all the set up like pre-loading assets, and some extra navigatory tools that are useful for talking about story development.

https://github.com/chachasikes/storybox
https://aframe.io/
https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

JSON -> Storybox -> AFrame -> ThreeJS -> WebGL -> HTML Canvas

JSON
A text based format for describing objects.
https://medium.com/omarelgabrys-blog/json-in-a-nutshell-7d638dfea7cc
https://www.digitalocean.com/community/tutorials/an-introduction-to-json


Camera
Camera position on loading (where you are placed in the scene - can be high or low, left or right)

Hand props
Can attach an object to your left or right hand. The object can be animated.
Connecting hand movements & touch button configurations is not yet supported & only applies to certain headsets.

Light
Quill drawings are meant to use hand-painted lights - and so do NOT have normal 3d lighting. The light used is ‘ambient.’

You can add extra lights, like a point light, sun, glows, reflections - but this might not look awesome with some Quill drawings. That will be experimentally supported.

Color space
We are still trying to understand AFrame’s, Quill’s & Blenders color spaces, but will have more information on what color space is supported.

Mesh
Only Obj and GLB files are supported for 3d objects.


Quill drawings are exported as Alembics (we have a document on how to do this, it’s very technical.) Alembic files are an exchange format that stores 3d animation data.

In Blender, we import the Alembic, fix the Material, deal with colors, and then export as GLB.
GLB is the all-in-one file format for GLTF.
GLTF is a web-friendly newer file format that supports baked 3d animations.
This lets us work with about 100MB files.

Tiltbrush & Oculus Quest
The Oculus Quest can run Tiltbrush, but to extract an .obj file, you need to also have an Oculus Rift - because only the Desktop version has an experimental export to .obj for your assets that you favorite from the Google Poly library. As of June 2019, it was a 16 step process, but can be done.

Tiltbrush Google Poly files can only export your illustration, not image files or obj files.

Loader
The general file size limit per project will probably be about 250MB. We are still testing and working on the loader and loading of assets. So long as the file doesn’t crash the browser, VR participants can wait a few seconds for their experience to load.

Texture
We are testing a variety of file texture replacements to apply onto GLB files.
We are first testing static objects, and then will move on to animated files.

To understand lighting & texturing, you can read about the one supported Material type here
https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMap

These are the texture types currently supported - but we should be able to support any of ThreeJS’s supported textures.


alphaMap
aoMap
bumpMap
emissiveMap
envMap
lightMap
normal
roughness

We have not tested high resolution textures yet.

We expect to mostly use noise & brush effects textures with Quill drawings.

Stretch Interface
There is a special stretch interface for the Rose Accordion

Wrist Panel (Debugger)
You can enable a debugger that shows up on your wrist. Useful since Oculus Quest doesn’t have any development tools at all.

Dropbox
If you publish you asset to Dropbox, share it (make it public) and get the URL, StoryBox will reformat that user to the downloadable version & use it to load. It’s pretty quick. This also means that if you shared your .glb file, every time you re-save it, it will be automatically published to the headset.
This only works with public URLs, private Dropbox support throught the API is not supported.

CubeMap & Panorama
You can add 6 cube faces, or use an equirectangular pano image as a scene background.
Naming for the cube faces: top, bottom, left, right, front, back.

Cursor Ring
You can show a cursor that will activate a play button upon staring at an item.

In development: Intersection Hit Event
If one item (hand or head) intersection with another item, do something.
We will use this for the Rose Accordion to play the scenes. This will require adding some extra code, but also there will be built in events like ‘play scene called X.’

Scene Duration
You can set up a series of scenes and set a duration & autoplay & the scenes will load sequentially after a time.

Planned: Storybox sub-scene storyboard navigation
We have some templates for storyboarding in VR.
We plan to make it easy to navigate through those board templates.

Text Panels
You can include text and labels at different locations in the scene.

Sound effect
You can load a sound effect & trigger it to play when something happens.


Planned: Title
Show the title of a piece and fade in.

Planned: Credits
Fade out & show credits.

In development: Asset Attribution
The JSON document can collect artist credit data.


Planned: Image
Place a static image in 3d space. Useful for titles.

Planned: Audio
We plan to include audio & spatialized audio.
We plan to be able to step through an audio file based on triggers.

Planned: Grab
It’s possible to support physics with AFrame & there are some libraries for grabbing items. We have a test planned to create a piece of furniture in Quill, and see if we can pull out a drawer.

Planned: 360 Video
Aframe can easily support 360 video.
Note: most 360 can easily cause nausea and discomfort.

Button Controls
The X button takes you to the menu.
Planned: The Y, A and B buttons could trigger special events.

Gaze Controls
We have one implementation of gaze (as a click trigger)

Planned: Flying & Teleportation
It is supposed to be possible to use the joystick buttons to fly or teleport around the scent.

In development: Navigation Buttons
It’s possible to play & pause and animation, and jump around the scenes.

Planned: Special Actions & Behaviors
An idea from Anselm (from his Blox project) is to add behaviors, like making a bee fly from one object to the next.

Example: School
One example we will build will be a ‘school’ (of fish) - experimenting with having one fish animation & setting a number of other fish & 3d spacing between each item.


Example: Flight Path
We can make an object move along a path. So in Quill, you could draw the motion path in 3d, and make another layer with your object, and export as separate files, then use the motion path with a direction & framerate.


Planned: Transparency
It might be possible to render transparency in GLB files, but it’s a little bit of a challenge with the materials.

Planned: Custom AFrame code
Depending on how things go with making projects, and technical capacity, we might be able to accept Aframe Markup & some component files & add those to the server.


Modifiers
For most objects, you can control the position, rotation, scale and opacity.

Planned: Fade in
So important! Figuring out some transparency & scene loading issues, so this might come later.

Planned: Scent Trigger
We will have some ways to trigger scents, hopefully in the spring of 2020.

Planned: Restricted Access
Not for the first year, but we plan to support unlisted experiences, and password protected experiences.


Oculus Quest
This wireless device contains a computer & web vr capable browser.

For best results: use the Oculus browser in Private mode & if there are code updates, close out of private mode. This is necessary because the Oculus web browser caches files & does not have a ‘clear cache’ button because it’s pretty bleeding edge.

Add the Storybox link to your bookmarks so you don’t have to type anything.

Menu of our Experiences
https://chachasikes.github.io/storybox/public

Demo Experiences
https://chachasikes.github.io/storybox/public/#rose_accordion
https://chachasikes.github.io/storybox/public/#tincture_of_sea

Forking & Active Development
The plan is that you can fork the app, or use glitch to make experiences.
If you are a web developer interested in this, reach out. The app itself is working, but has its own technical plan for improvements that’s outside the scope of this packet.

import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
  }
  init(target) {
    let story = new StoryBoxBuilder(target);
    window.StoryBoxBuilder = story;
    story.render(target);
  }
}


(function () {
'use strict';

// XR globals.
let xrButton = null;
let xrExclusiveFrameOfRef = null;
let xrNonExclusiveFrameOfRef = null;

// WebGL scene globals.
let gl = null;
let renderer = null;
let scene = window.StoryBoxBuilder;

function initXR() {
  xrButton = new XRDeviceButton({
    onRequestSession: onRequestSession,
    onEndSession: onEndSession
  });
  document.querySelector('header').appendChild(xrButton.domElement);

  if (navigator.xr && navigator.xr.requestDevice) {
    navigator.xr.requestDevice().then((device) => {
      xrButton.setDevice(device);

      if (!device)
        return;

      // In order for a non-immersive session to be used we must provide
      // an outputContext, which indicates the canvas that will contain
      // results of the session's rendering.
      let outputCanvas = document.createElement('canvas');
      let ctx = outputCanvas.getContext('xrpresent');

      // Pick an arbitrary device for the magic window content and start
      // up a non-immersive session if possible.
      device.requestSession({ outputContext: ctx })
          .then((session) => {
            // Add the canvas to the document once we know that it will be
            // rendered to.
            document.body.appendChild(outputCanvas);
            onSessionStarted(session);
          });
    });
  } else {
    console.log("No XR support found");
    console.log(window.App)
  }
}

function onRequestSession(device) {
  device.requestSession({ immersive: true }).then((session) => {
    xrButton.setSession(session);
    onSessionStarted(session);
  });
}

function onSessionStarted(session) {
  session.addEventListener('end', onSessionEnded);

  if (!gl) {
    gl = createWebGLContext({
      compatibleXRDevice: session.device
    });

    renderer = new Renderer(gl);

    scene.setRenderer(renderer);
  }

  session.baseLayer = new XRWebGLLayer(session, gl);

  session.requestFrameOfReference('eye-level').then((frameOfRef) => {
    // Since we're dealing with multple sessions now we need to track
    // which XRFrameOfReference is associated with which XRSession.
    if (session.immersive) {
      xrExclusiveFrameOfRef = frameOfRef;
    } else {
      xrNonExclusiveFrameOfRef = frameOfRef;
    }
    session.requestAnimationFrame(onXRFrame);
  });
}

function onEndSession(session) {
  session.end();
}

function onSessionEnded(event) {
  // Only reset the button when the immersive session ends.
  if (event.session.immersive)
    xrButton.setSession(null);
}

// Called every time a XRSession requests that a new frame be drawn.
function onXRFrame(t, frame) {
  let session = frame.session;
  // Ensure that we're using the right frame of reference for the session.
  let frameOfRef = session.immersive ?
                   xrExclusiveFrameOfRef :
                   xrNonExclusiveFrameOfRef;
  let pose = frame.getDevicePose(frameOfRef);

  scene.startFrame();

  session.requestAnimationFrame(onXRFrame);

  gl.bindFramebuffer(gl.FRAMEBUFFER, session.baseLayer.framebuffer);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (pose) {
    for (let view of frame.views) {
      let viewport = session.baseLayer.getViewport(view);
      gl.viewport(viewport.x, viewport.y,
                  viewport.width, viewport.height);

      scene.draw(view.projectionMatrix, pose.getViewMatrix(view));
    }
  }

  scene.endFrame();
}

// Start the XR application.
initXR();
})();

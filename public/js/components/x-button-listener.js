export function registerComponent() {
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
}

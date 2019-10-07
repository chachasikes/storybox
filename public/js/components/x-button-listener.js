export function registerComponent() {
      if (AFRAME.components["x-button-listener"] === undefined) {
  AFRAME.registerComponent("x-button-listener", {
    init: function() {
      var el = this.el;
      el.addEventListener(
        "xbuttondown",
        window.StoryboxNavigator.xButtonEvent
      );
    },
    update: function() {
      var el = this.el;
      el.addEventListener(
        "xbuttondown",
        window.StoryboxNavigator.xButtonEvent
      );
    }
  });
}
}

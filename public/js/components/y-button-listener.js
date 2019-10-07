export function registerComponent() {
      if (AFRAME.components["y-button-listener"] === undefined) {
  AFRAME.registerComponent("y-button-listener", {
    init: function() {
      var el = this.el;
      el.addEventListener(
        "ybuttondown",
        window.StoryboxNavigator.yButtonEvent
      );
    },
    update: function() {
      var el = this.el;
      el.addEventListener(
        "ybuttondown",
        window.StoryboxNavigator.yButtonEvent
      );
    }
  });
}
}

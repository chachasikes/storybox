export function registerComponent() {
      if (AFRAME.components["a-button-listener"] === undefined) {
  AFRAME.registerComponent("a-button-listener", {
    init: function() {
      var el = this.el;
      el.addEventListener("abuttondown", function(evt) {
        vrlog("A");
      });
    }
  });
}
}

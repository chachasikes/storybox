export function registerComponent() {
      if (AFRAME.components["b-button-listener"] === undefined) {
  AFRAME.registerComponent("b-button-listener", {
    init: function() {
      var el = this.el;
      el.addEventListener("bbuttondown", function(evt) {
        vrlog("B");
      });
    }
  });
}
}

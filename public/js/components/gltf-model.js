export function registerComponent() {
  if (AFRAME.components["gltf-model-draco"] === undefined) {
    AFRAME.registerComponent("gltf-model-draco", {
      schema: { type: "model" },
      init: function() {
        var e = this.system.getDRACOLoader();
        (this.model = null),
          (this.loader = new THREE.GLTFLoader()),
          e && this.loader.setDRACOLoader(e);
      },
      update: function() {
        var e = this,
          o = this.el,
          t = this.data;
        t &&
          (this.remove(),
          this.loader.load(
            t,
            function(t) {
              (e.model = t.scene || t.scenes[0]),
                (e.model.animations = t.animations),
                o.setObject3D("mesh", e.model),
                o.emit("model-loaded", { format: "gltf", model: e.model });
            },
            void 0,
            function(e) {
              var r = e && e.message ? e.message : "Failed to load glTF model";
              console.log(r), o.emit("model-error", { format: "gltf", src: t });
            }
          ));
      },
      remove: function() {
        this.model && this.el.removeObject3D("mesh");
      }
    });
  }
}

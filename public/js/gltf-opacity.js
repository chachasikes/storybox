AFRAME.registerComponent('gltf-opacity', {
    schema: {
      opacity: { default: 1.0 },
    },
    init: function() {
      this.el.addEventListener('model-loaded', () => this.update());
    },
    update: function() {
      object = this.el.getObject3D('mesh');
      if (!object) return;
      object.traverse((node) => {
        if (node !== undefined && node.isMesh) node.material.opacity = this.data;
      });
    }
  }
);

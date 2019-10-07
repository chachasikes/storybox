//https://glitch.com/edit/#!/stack-52423883?path=index.html:32:10
export function registerComponent() {
AFRAME.registerComponent('model-opacity', {
       schema: {default: 0.5},
       init: function () {
         // this.el.addEventListener('model-loaded', this.update.bind(this));
         this.el.addEventListener("model-loaded", ()=>{
           const object3DEl = this.el.object3DMap;
         // console.log('this.el.object3DMap:', object3DEl);

         var mesh = this.el.getObject3D('mesh'); // For hand, the result is undefined
         // var mesh = this.el.object3DMap.mesh; // For hand, the result is undefined
         // console.log(mesh);
         var data = this.data;
         if (!mesh) { return; }
         mesh.traverse(function (node) {
           if (node !== undefined && node.isMesh) {
             // console.log(node);
             node.material.opacity = data;
             // node.material.transparent = data < 1.0;
             // node.material.needsUpdate = true;
           }
         });
         }, 2000)


       },
       update: function () {
         var mesh = this.el.getObject3D('mesh');
         var data = this.data;
         if (!mesh) { return; }
         mesh.traverse(function (node) {
           if (node !== undefined && node.isMesh) {
             console.log(data);
             node.material.opacity = data;
             // node.material.transparent = data < 1.0;
             // node.material.needsUpdate = true;
           }
         });
       }
     });
}

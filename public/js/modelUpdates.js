export default function modelLoadedEvent() {

  // console.log('model loaded event');
  // // var texturedElements = document.querySelector(".textured");
  // var glbElements = document.querySelectorAll('.glb-animation');
  //
  // // console.log(texturedElements);
  // // if (texturedElements !== undefined && texturedElements !== null) {
  // //   texturedElements.forEach(el => {
  // //     let id = el.getAttribute('id');
  // //     console.log(id);
  // //     el.addEventListener('model-loaded', (e) => {
  // //       if (id !== undefined) {
  // //         console.log(this.materials[id]);
  // //         e.detail.model.traverse(function(node) {
  // //           if (node.isMesh) node.material.map = this.materials[id];
  // //         });
  // //       }
  // //       // this.update();
  // //     });
  // //   });
  // // }
  //
  // if (glbElements !== undefined && glbElements !== null) {
  //   let counter = 0;
  //   glbElements.forEach(el => {
  //
  //     let ref = el.getAttribute('ref');
  //     // console.log( window.StoryboxAframe.materials[ref]);
  //     el.addEventListener('model-loaded', (e) => {
  //       if (ref !== undefined) {
  //
  //         const obj = el.getObject3D('mesh');
  //
  //         obj.traverse(node => {
  //                   // if (node.name.indexOf('ship') !== -1) {
  //                   if (node.material !== undefined) {
  //                     // node.material = window.StoryboxAframe.materials[ref];
  //                     // node.material.opacity = 0.5;
  //                     // node.material.transparent = true;
  //                     // node.material.needsUpdate = true;
  //                   }
  //
  //
  //
  //                   if (node.children.length > 0) {
  //
  //                     node.children.map(item => {
  //                       if (item.material !== undefined) {
  //
  //                         // item.material = Object.assign(item.material, window.StoryboxAframe.materials[ref]);
  //                         // item.material.opacity = 0.5;
  //                       }
  //                       if (item.children.length > 0) {
  //                         if (item.children.material !== undefined) {
  //                           // item.children.material = window.StoryboxAframe.materials[ref];
  //                           // item.children.material.opacity = 0.5;
  //                           // item.children.material.transparent = true;
  //                           // item.children.material.needsUpdate = true;
  //                         }
  //                       }
  //
  //                     });
  //                   }
  //                 });
  //         // e.detail.model.traverse(function(node) {
  //         //   if (node.isMesh) node.material.map = window.StoryboxAframe.materials[ref];
  //         // });
  //       }
  //       this.update();
  //     });
  //   });
  }

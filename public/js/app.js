import { StoryBoxBuilder } from './StoryBoxBuilder.js';
export class App {
  constructor() {
  }

  setupAppButtons() {
    AFRAME.registerComponent('x-button-listener', {
      init: function () {
        var el = this.el;
        el.addEventListener('xbuttondown', function (evt) {
          console.log('down');
          window.StoryBoxBuilder.galleryItemSelect('gallery');
        });
      }
    });
  }

  init(target) {
    window.StoryBoxBuilder = new StoryBoxBuilder(target);
    let rendered = window.StoryBoxBuilder.render(target);
    let setup = window.StoryBoxBuilder.setupGallery();
    this.setupAppButtons();
  }
}

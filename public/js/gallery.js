export class Gallery {
  constructor() {
    this.registry = null;
    this.gallery = {
      className: "clickable-tile",
      rowLength: 5,
      currentRow: 0,
      currentColumn: 1,
      itemWidth: -40,
      itemHeight: -70,
      gutter: -8,
      itemDepth: -20,
    };
  }

  getPosition(item, index) {
    let length = this.registry.length;
    let overflowRow = length % this.gallery.rowLength;
    this.gallery.numberRows = (length - overflowRow) / this.gallery.rowLength;

    if (overflowRow !== 0) {
      this.gallery.numberRows = this.gallery.numberRows + 1;
    }

    this.gallery.currentColumn = index;
    let rowCounter = 1;
    if (this.gallery.currentColumn >= this.gallery.rowLength) {
      this.gallery.currentRow = this.gallery.currentRow + 1;
      this.gallery.currentColumn = 0;
    }

    let x = (this.gallery.currentColumn * this.gallery.itemWidth) + (this.gallery.currentColumn * this.gallery.gutter);
    let y = (this.gallery.currentRow * this.gallery.itemHeight) + (this.gallery.currentRow * this.gallery.gutter);
    return {
      tag: `position="${x} ${y - 20} ${this.gallery.itemDepth}"`,
      dimensions: {
        x: x,
        y: y - 20,
        z: this.gallery.itemDepth
      }
    }
  }

  render(registry) {
    this.registry = registry;
    let content = ``;
    let tiles = [];
    let assets = [];

    let position = `position="0 0 0"`;
    let scale = `scale="40 40 40"`;
    let rotation = `rotation="0 0 0"`;

    registry.map((item, index) => {

      position = this.getPosition(registry[index], index);

      assets.push(
        `<img id="select-${item.id}" src="${item.panel}" crossorigin="anonymous" preload="true" />`
      );
      tiles.push(`
        <a-image
        data-clickable
        cursor-listener
        visible="true"
        event-set__mouseenter="scale: 42 42 42;"
        event-set__mouseleave="scale: 40 40 40;"
        id="${item.id}"
        class="${this.gallery.className}" src="#select-${item.id}" material="alphaTest: 0.5" ${position.tag} ${scale} ${rotation}>
        </a-image>
        <a-entity text="value: ${item.name}; width: ${this.gallery.itemWidth * -1}; color: #000000" position="${position.dimensions.x} ${position.dimensions.y - 23} ${position.dimensions.z}"  ${rotation}></a-entity>
      `
      );

    });
    return {
      assetsElements: assets,
      tiles
    }
  }
}

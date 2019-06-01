export class Gallery {
  constructor() {
    this.registry = null;
    this.gallery = {
      className: "clickable-tile",
      rowLength: 1,
      currentRow: 0,
      currentColumn: 1,
      itemWidth: -50,
      itemHeight: -50,
      gutter: -10
    };
  }

  getPosition(item, index) {
    let length = this.registry.length;
    console.log('len', length, this.gallery.rowLength);
    let overflowRow = length % this.gallery.rowLength;
    console.log('ov', overflowRow);
    this.gallery.numberRows = (length - overflowRow) / this.gallery.rowLength;

    if (overflowRow !== 0) {
      this.gallery.numberRows = this.gallery.numberRows + 1;
    }

    console.log('number rows', this.gallery.numberRows);
    this.gallery.currentColumn = index;
    let rowCounter = 1;
    if (this.gallery.currentColumn >= this.gallery.rowLength) {
      this.gallery.currentRow = this.gallery.currentRow + 1;
      this.gallery.currentColumn = 0;
    }

    console.log('r c', this.gallery.currentRow, this.gallery.currentColumn);
    let x = (this.gallery.currentColumn * this.gallery.itemWidth) + (this.gallery.currentColumn * this.gallery.gutter);
    let y = (this.gallery.currentRow * this.gallery.itemHeight) + (this.gallery.currentRow * this.gallery.gutter);
    console.log('x y', x, y);
    return `position="${x} ${y} 0.1"`;
  }

  render(registry) {
    this.registry = registry;
    let content = ``;
    let tiles = [];
    let assets = [];

    let position = `position="0 0 0"`;
    let scale = `scale="50 50 50"`;
    let rotation = `rotation="0 0 0"`;

    registry.map((item, index) => {

      position = this.getPosition(registry[index], index);

      assets.push(
        `<img class="${this.gallery.className}" id="select-${item.id}" src="${item.panel}" crossorigin="anonymous" preload="true" />`
      );
      tiles.push(`
        <a-image class="${this.gallery.className}" src="#select-${item.id}" material="alphaTest: 0.5" ${position} ${scale} ${rotation}>
        </a-image>`
      );

    });
    return {
      assetsElements: assets,
      tiles
    }
  }
}

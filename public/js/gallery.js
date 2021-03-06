/**
 * Build Gallery (clickable images in rows)
 * @module Gallery
 */
export class Gallery {
  constructor() {
    this.registry = null;
    this.gallery = {
      className: "clickable-tile",
      rowLength: 2,
      currentRow: 0,
      currentColumn: 1,
      itemWidth: 40,
      itemWidthExpanded: 42,
      itemHeight: 55,
      gutter: 6,
      itemDepth: 20,
      yOffset: 10,
      textYOffset: 25,
      galleryYOffset: -100,
    };
  }

  /**
   * Get position of item in grid.
   * @param {string} item - Item in registry
   * @param {number} index - Current item index
   */
  getGridPosition(item, index) {
    index = index + 2; // Skip any zeroes
    let length = this.registry.length;
    let overflowRow = length % this.gallery.rowLength;
    this.gallery.numberRows = (length - overflowRow) / this.gallery.rowLength;

    if (overflowRow !== 0) {
      this.gallery.numberRows = this.gallery.numberRows + 1;
    }

    this.gallery.currentColumnMaxIndex = this.gallery.currentRow * this.gallery.rowLength;
    this.gallery.currentColumnMinIndex = this.gallery.currentRow * this.gallery.rowLength - this.gallery.rowLength;
    if (this.gallery.currentColumnMinIndex < 0) {
      this.gallery.currentColumnMinIndex = 0;
    }

    this.gallery.currentColumn = (this.gallery.currentColumnMaxIndex - index) + 3; // Current position & offset
    this.gallery.currentRow = Math.floor((index)  / this.gallery.rowLength);

    // console.log('num row', this.gallery.numberRows, 'index', index, 'cur col', this.gallery.currentColumn, 'cur row', this.gallery.currentRow);

    let x = (this.gallery.currentColumn * this.gallery.itemWidth * -1) + (this.gallery.currentColumn * this.gallery.gutter * -1);
    let y = (this.gallery.currentRow * this.gallery.itemHeight) + (this.gallery.currentRow * this.gallery.gutter)  + this.gallery.galleryYOffset;
    return {
      tag: `position="${x} ${y + this.gallery.yOffset} ${this.gallery.itemDepth}"`,
      dimensions: {
        x: x,
        y: y + this.gallery.yOffset,
        z: this.gallery.itemDepth
      }
    }
  }

  /**
   * Build markup of grid with clickable images.
   * @param {registry} registry - Array of registry items.
   */
  render(registry) {
    this.registry = registry;
    let content = ``;
    let grid = [];
    let assets = [];

    let position = `position="0 0 0"`;
    let scale = `scale="${this.gallery.itemWidth} ${this.gallery.itemWidth} ${this.gallery.itemWidth}"`;
    let rotation = `rotation="0 0 0"`;

    registry.map((item, index) => {

      position = this.getGridPosition(registry[index], index);

      assets.push(
        `<img id="select-${item.id}" src="${item.panel}" crossorigin="anonymous" preload="true" />`
      );
      grid.push(`
        <a-image
        data-clickable
        cursor-listener
        visible="true"
        event-set__mouseenter="scale: ${this.gallery.itemWidthExpanded} ${this.gallery.itemWidthExpanded} ${this.gallery.itemWidthExpanded};"
        event-set__mouseleave="scale: ${this.gallery.itemWidth} ${this.gallery.itemWidth} ${this.gallery.itemWidth};"
        id="${item.id}"
        class="${this.gallery.className}" src="#select-${item.id}" material="alphaTest: 0.5" ${position.tag} ${scale} ${rotation}>
        </a-image>
        <a-entity
          text="value: ${item.name}; width: ${this.gallery.itemWidth}; wrapPixels: 480; color: #000000;"
          position="${position.dimensions.x} ${position.dimensions.y - this.gallery.textYOffset} ${position.dimensions.z}"
          ${rotation}>
        </a-entity>
      `
      );
    });
    return {
      childElements: assets,
      grid
    }
  }
}

import config from '../config.js';
const {
  CELL_WIDTH,
  PAGE_OFFSET_X,
  PAGE_OFFSET_Y,
} = config;

const bgUrl = 'images/cell_bg.png';
const tile_center = {
  x:3,
  y:3,
  width:70,
  height:70
};
let ctx = null;
let image = null;

export default class Cell_bg{
  constructor(_ctx, map = [[]]) {
    ctx = _ctx;
    this.map = map;
    this.init();
    this.readying = false;
  }

  init(){
    image = wx.createImage();
    image.onload = () => {
      this.readying = true;
    }
    image.src = bgUrl;
  }

  changeMap(map){
    this.map = map;
  }

  draw() {
    if(this.readying === false){
      return this;
    }
    this.map.forEach((col, x) => {
      col.forEach((cell, y) => {
        if (cell === 1) {
          ctx.drawImage(image, tile_center.x, tile_center.y, tile_center.width, tile_center.height, x * CELL_WIDTH + PAGE_OFFSET_X, y * CELL_WIDTH + PAGE_OFFSET_Y, CELL_WIDTH, CELL_WIDTH);
        }
      });
    });
  }
};
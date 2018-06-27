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

export default class Cell_bg{
  constructor(map=[[]]){
    this.map = map;
    this.init();
    this.readying = false;
  }

  init(){
    let image = wx.createImage();
    image.onload = () => {
      this.readying = true;
    }
    image.src = bgUrl;
    this.image = image;
  }

  changeMap(map){
    this.map = map;
  }

  draw(){
    if(this.readying === false){
      return this;
    }
    this.map.forEach(col => {
      col.forEach(cell => {

      });
    });
  }
};
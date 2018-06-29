import config from '../config.js';
import Ele from './ele.js';
const {
  CELL_WIDTH,
  PAGE_OFFSET_X,
  PAGE_OFFSET_Y,
  FPS
} = config;

let images = {};
let ctx = null;

export function setCtx(_ctx) {
  ctx = _ctx;
}

export class Cell extends Ele {
  /**
   * 格子
   * @constructor
   * @param {number} x 在地图中的x坐标
   * @param {number} y 在地图中的y坐标
   * @param {number} bombType 炸弹类型 0=> 非炸弹 1=> x轴炸弹 2=>y轴炸弹 3=>同类型炸弹
   */
  constructor(x = 0, y = 0, bombType = 0, type = null) {
    super(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
    this.x = x;
    this.y = y;
    this.type = type === null ? Math.round(Math.random() * 4) : type;
    this.src = `images/cell_${this.type}.png`;
    this.bombType = bombType;
    this.active = false;
    this.deaded = false;
    this.moving = false;
    this.frames = 0;
    this.animateTime = 0;
  }

  draw() {
    let x = this.pageX + PAGE_OFFSET_X;
    let y = this.pageY + PAGE_OFFSET_Y;
    let size = 32;
    let sx = this.frames * size;
    let sy = 0;
    let image = images[this.type];
    if (this.moving === true || this.bombType) {
      this.frames++;
      if (this.frames > 9) {
        this.frames = 0;
      }
    } else {
      this.frames = 0;
    }
    if (image) {
      ctx.drawImage(image, sx, sy, size, size, x, y, this.width, this.height);
    }else{
      image = wx.createImage();
      image.onload = () => {
        ctx.drawImage(image, sx, sy, size, size, x, y, this.width, this.height);
        images[this.type] = image;
      }
      image.src = this.src;
    }
    return this;
  }

  reset() {
    // this.pageX = this.x * CELL_WIDTH;
    // this.pageY = this.y * CELL_WIDTH;
    this.animateTo(this.x * CELL_WIDTH, this.y * CELL_WIDTH, 0.2);
  }

  move(offsetX = 0, offsetY = 0) {
    this.pageX = (this.x * CELL_WIDTH) + offsetX;
    this.pageY = (this.y * CELL_WIDTH) + offsetY;
    return this;
  }

  remove() {
    let step = 10;
    this.width -= step;
    this.height -= step;
    this.pageX += step / 2;
    this.pageY += step / 2;
    this.moving = true;
    if (this.width >= step) {
      requestAnimationFrame(() => {
        this.remove();
      });
    } else {
      this.deaded = true;
    }
  }
};

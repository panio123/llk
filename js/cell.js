import config from './config.js';
const {
  CELL_WIDTH,
  PAGE_OFFSET_X,
  PAGE_OFFSET_Y,
  FPS
} = config;

let images = {};
let id = 0;
let ctx = null;

export function setCtx(_ctx) {
  ctx = _ctx;
}

export class Cell {
  constructor(x = 0, y = 0, level = 1, autoDie) {
    let type = (Math.floor(Math.random() * (level + 4)));
    // let type = Math.round(Math.random() * 4)+1;
    this.src = `images/cell_${type}.png`;
    this.x = x;
    this.y = y;
    this.pageX = x * CELL_WIDTH;
    this.pageY = y * CELL_WIDTH;
    this.width = this.height = CELL_WIDTH;
    this.type = type;
    this.isBomb = autoDie=== true?false:Math.floor(Math.random() * 80) === 0;
    this.id = ++id;
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
    // requestAnimationFrame(() => {
    //   this.animate();
    // });
    if (this.moving === true || this.isBomb === true){
      this.frames++;
      if (this.frames > 9) {
        this.frames = 0;
      }
    }else{
      this.frames = 0;
    }
    if (images[this.type]) {
      ctx.drawImage(images[this.type], sx, sy, size, size, x, y, this.width, this.height);
      return this;
    }
    let image = wx.createImage();
    image.onload = () => {
      ctx.drawImage(image, sx, sy, size, size, x, y, this.width, this.height);
      images[this.type] = image;
    }
    image.src = this.src;
    return this;
  }

  reset() {
    this.pageX = this.x * CELL_WIDTH;
    this.pageY = this.y * CELL_WIDTH;
    // this.moveTo(this.x * CELL_WIDTH, this.y * CELL_WIDTH, 0.2);
  }

  animate() {
    this.animateTime++;
    if (this.animateTime === 6) {
      this.animateTime = 0;
      this.frames++;
      if (this.frames > 9) {
        this.frames = 0;
      }
    }
  }

  move(offsetX = 0, offsetY = 0) {
    this.pageX = (this.x * CELL_WIDTH) + offsetX;
    this.pageY = (this.y * CELL_WIDTH) + offsetY;
    return this;
  }

  moveTo(pageX, pageY, duration = 0.5) {
    if (pageX === this.pageX && pageY === this.pageY) {
      return this;
    }
    let time = FPS * duration;
    let stepX = (pageX - this.pageX) / time;
    let stepY = (pageY - this.pageY) / time;
    this.moving = true;
    let move = () => {
      let needMove = false;
      this.pageX += stepX;
      this.pageY += stepY;
      if (this.pageX < pageX) {
        needMove = true;
      } else if (this.pageX >= pageX) {
        this.pageX = pageX;
      }
      if (this.pageY < pageY) {
        needMove = true;
      } else if (this.pageY >= pageY) {
        this.pageY = pageY;
      }
      if (needMove === true) {
        requestAnimationFrame(() => {
          move();
        });
      } else {
        this.moving = false;
      }
    }
    move();
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
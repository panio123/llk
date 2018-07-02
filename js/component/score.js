import Ele from './ele.js';
import Num from './number.js';
const stepBgUrl = 'images/step_bg.png';
const map = {
  leaf1: {
    x: 0,
    y: 110,
    width: 175,
    height: 80
  },
  leaf2: {
    x: 95,
    y: 0,
    width: 150,
    height: 110
  },
  leaf3: {
    x: 0,
    y: 0,
    width: 75,
    height: 50
  },
  plank: {
    x: 280,
    y: 0,
    width: 165,
    height: 185
  }
};
const plankPosition = {
  x: window.innerWidth - 90,
  y:20,
  width:80,
  height:80
}
let ctx = null;
let image = null;

export default class Score {
  constructor(_ctx) {
    this.readying = false;
    this.steps = 30;
    this.init();
    ctx = _ctx;
  }

  init() {
    this.loadImage();
    this.createStepNum();
  }

  loadImage() {
    image = wx.createImage();
    image.onload = () => {
      this.readying = true;
    }
    image.src = stepBgUrl;
  }

  createStepNum() {
    this.stepNum = new Num({
      imgUrl: 'images/step_num.png',
      map:{
        0:{
          x:5,
          y:58,
          width:41,
          height: 42,
          numWidth: 20,
          numHeight: 22
        }, 
        1: {
          x: 186,
          y: 58,
          width: 24,
          height: 42,
          numWidth: 15,
          numHeight: 22
        },
        2: {
          x: 54,
          y: 58,
          width: 37,
          height: 42,
          numWidth: 18,
          numHeight: 22
        },
        3: {
          x: 141,
          y: 58,
          width: 37,
          height: 42,
          numWidth: 18,
          numHeight: 22
        },
        4: {
          x: 51,
          y: 5,
          width: 37,
          height: 42,
          numWidth: 18,
          numHeight: 22
        },
        5: {
          x: 99,
          y: 58,
          width: 35,
          height: 42,
          numWidth: 18,
          numHeight: 22
        },
        6: {
          x: 97,
          y: 5,
          width: 39,
          height: 42,
          numWidth: 18,
          numHeight: 22
        },
        7: {
          x: 186,
          y: 5,
          width: 35,
          height: 42,
          numWidth: 17,
          numHeight: 22
        },
        8: {
          x: 141,
          y: 5,
          width: 37,
          height: 42,
          numWidth: 18,
          numHeight: 22
        },
        9: {
          x: 4,
          y: 5,
          width: 38,
          height: 42,
          numWidth: 18,
          numHeight: 22
        }
      },
      numWidth: 22,
      numHeight: 22
    }, plankPosition.x + (plankPosition.width / 2), plankPosition.y + 42, this.steps);
  }

  drawStepBg({
    x,
    y,
    width,
    height
  }, _x, _y, w, h) {
    ctx.drawImage(image, x, y, width, height, _x, _y, w || width, h || height);
  }

  draw() {
    if (this.readying === false) return this;
    this.drawStepBg(map.leaf1, -30, -30);
    this.drawStepBg(map.leaf3, 180, -30);
    this.drawStepBg(map.plank, plankPosition.x, plankPosition.y, plankPosition.width, plankPosition.height);
    this.drawStepBg(map.leaf2, window.innerWidth - 100, -40);
    this.drawStepBg(map.leaf2, -80, 10);
    this.stepNum.draw(ctx);
  }

  changeStep(num){
    this.steps = num;
  }

  getStep(){
    return this.steps;
  }

  increase() {
    this.stepNum.setNum(++this.steps);
  }

  decrease() {
    this.stepNum.setNum(--this.steps);
  }
};
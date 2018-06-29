import config from '../config.js';
const {
  FPS
} = config;

let id = 0;

export default class Ele {
  /**
   * 基本元素
   * @constructor
   * @param {number} pageX x轴位置
   * @param {number} pageY y轴位置
   * @param {number} width 宽度
   * @param {number} height 高度
   * @param {number} scale 缩放比例
   */
  constructor(pageX = 0, pageY = 0, width = 0, height = 0, scale = 1) {
    this.id = ++id;
    this.pageX = pageX;
    this.pageY = pageY;
    this.width = width;
    this.height = height;
  }
  /**
   * 移动到指定位置，不带动画，直接蹦过去的那种
   */
  moveTo(pageX = 0, pageY = 0) {
    this.pageX = pageX;
    this.pageY = pageY;
  }
  /**
   * 偏移元素
   */
  offsetTo(offsetX = 0, offsetY = 0) {
    this.pageX += offsetX;
    this.pageY += offsetY;
  }
  /**
   * 将元素动画到指定位置
   * @param {number} destinationX x轴目标位置
   * @param {number} destinationY y轴目标位置
   * @param {number} duration 动画持续时间，单位秒
   */
  animateTo(destinationX = 0, destinationY = 0, duration = 1) {
    return new Promise((resolve, reject) => {
      if (this.moving === true){
        resolve();
        return;
      };
      let steps = FPS * duration;
      let distanceX = destinationX - this.pageX;
      let distanceY = destinationY - this.pageY;
      let stepSizeX = distanceX / steps;
      let stepSizeY = distanceY / steps;
      let timer;
      let move = () => {
        if (this.pageX === destinationX) {
          stepSizeX = 0;
        }
        if (this.pageY === destinationY) {
          stepSizeY = 0;
        }
        if (this.pageX >= destinationX && this.pageY >= destinationY) {
          this.pageX = destinationX;
          this.pageY = destinationY;
          this.moving = false;
          resolve();
          clearInterval(timer);
        } else {
          this.offsetTo(stepSizeX, stepSizeY);
        }
      };
      this.moving = true;
      timer = setInterval(move, 1000 / FPS);
    });
  }
};
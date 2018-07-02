
export default class Num{
  /**
   * 数字精灵元素
   * @constructor
   * @param {object} config 数字精灵图片配置
   * @param {string} config.imgUrl 图片地址
   * @param {object} config.map 图片map信息 {0:{x,y,width,height,numWidth,numHeight},1:{...}}
   * @param {number} pageX 页面X轴位置
   * @param {number} pageY 页面Y轴位置
   * @param {number} num 初始值
   * @param {string} position 文字X轴的对齐位置 center left right，Y轴只能按顶部来对齐，相当于Y轴为top
   */
  constructor(config, pageX, pageY, num = 0, position='center'){
    this.config = config;
    this.readying = false;
    this.num = num;
    this.animate = false;
    this.pageX = pageX;
    this.pageY = pageY;
    this.position = position;
    this.init();
    this.calcStartPageX();
  }

  init(){
    let image = wx.createImage();
    image.onload = () => {
      this.readying = true;
    };
    image.src = this.config.imgUrl;
    this.image = image;
  }

  draw(ctx) {
    if (this.readying === false) return this;
    let { map } = this.config;
    let nums = `${this.num}`.split('');
    let offsetX = this.startPageX;
    nums.forEach((num,index)=>{
      let { x, y, width, height, numWidth, numHeight } = map[num];
      ctx.drawImage(this.image, x, y, width, height, offsetX, this.pageY, numWidth, numHeight);
      offsetX += numWidth;
    });
  }

  calcStartPageX() {
    let { numWidth } = this.config;
    let nums = `${this.num}`;
    switch(this.position){
      case 'left':
        this.startPageX = this.pageX;
      break;
      case 'center':
        let halfTotalWidth = this.calcTotalWidth(nums.split('')) / 2;
        this.startPageX = this.pageX - halfTotalWidth;
      break;
      case 'right':
        let totalWidth = this.calcTotalWidth(nums.split('')) ;
      this.startPageX = this.pageX - totalWidth;
      default:
        this.startPageX = this.pageX;
    }
  }

  calcTotalWidth(arr) {
    let { map } = this.config;
    let totalWidth = 0;
    arr.forEach(num => {
      let { x, y, width, height, numWidth, numHeight } = map[num];
      totalWidth += numWidth;
    })
    return totalWidth;
  }

  setNum(num){
    if(this.animate === true){
      this.num = num;
    }else{
      this.num = num;
    }
    this.calcStartPageX();
  }
}
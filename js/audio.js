export default class Audio {
  constructor() {
    let bgm = wx.createInnerAudioContext();
    bgm.autoplay = true;
    bgm.loop = true;
    bgm.volume = 0.3;
    bgm.src = 'audio/bgm.mp3';
    this.bgm = bgm;


    let down = wx.createInnerAudioContext();
    down.src = 'audio/down.mp3';
    this.down = down;

    this.booms = [];
    for(let i = 1;i<4;i++){
      let boom = wx.createInnerAudioContext();
      boom.src = `audio/eliminate_${i}.mp3`;
      this.booms.push(boom);
    }

    this.combos = [];
    for (let i = 1; i < 5; i++) {
      let combo = wx.createInnerAudioContext();
      combo.src = `audio/combo_${i}.mp3`;
      this.combos.push(combo);
    }
  }

  playBgm(){
    this.bgm.play();
  }

  stopBgm(){
    this.bgm.stop();
  }

  playBoom(combo=0){
    let boom;
    if (combo === 0){
      boom = this.booms[Math.round(Math.random() * 2)];
    }else{
      boom = this.combos[Math.min(combo-1,3)];
    }
    if (combo === 0) {
    boom.seek(0);
    }
    boom.play();
  }

  playDown(){
    this.down.play();
  }

};
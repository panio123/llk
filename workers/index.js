let time = 0;
let timer = null;

worker.onMessage(function ({type,data}) {
  switch(type){
    case 'startTime':
      this.startTime();
    break;
    case 'stopTime':
      this.stopTime();
    break;
    case 'resetTime':
      time = data||0;
    break;
  }
})

function timer(){
  time++;
  worker.postMessage(time);
}

function startTime(){
  timer = setInterval(()=>{
    timer();
  },1000);
};

function stopTime() {
  clearInterval(timer);
};


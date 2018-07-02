import {
  Cell,
  setCtx
} from './component/cell.js';
import config from './config.js';
import Audio from './audio.js';
import Cell_bg from './component/cell_bg.js';
import Score from './component/score.js';
import mpaList from './map/index.js';

const {
  COL,
  ROW,
  CELL_WIDTH,
  FPS,
  MAX_LEVEL,
  LEVEL_NUM,
  PAGE_OFFSET_X,
  PAGE_OFFSET_Y
} = config;


let selectedCell1 = null;
let selectedCell2 = null;
let lastSelectedCell2 = null;
let autoCheck = false;
let x1;
let y1;
let pageX1;
let pageY1;
let lastDirection;
let ctx = canvas.getContext('2d');
let canTouch = false;
let score = 0;
let time = 0;
let level = 0;
let combo = 0;
let comboTimer = null;
let bg = null;
let MAP = mpaList[level];
let placeholders = [];

let audio = new Audio();
let cell_bg = new Cell_bg(ctx, mpaList[level]);
let _score = new Score(ctx);

// let worker = wx.createWorker('workers/index.js');

// worker.onMessage(function (res) {
//   time = 0;
// })

setCtx(ctx);

wx.setPreferredFramesPerSecond(FPS);

export default class Main {
  constructor() {
    this.init();
    wx.onTouchStart((e) => {
      console.log(selectedCell1);
      if (canTouch === true) {
        this.touchStart(e.touches[0]);
      }
    });
    wx.onTouchMove((e) => {
      // console.log(selectedCell1);
      if (selectedCell1) {
        this.touchMove(e.touches[0]);
      }
    });
    wx.onTouchEnd((e) => {
      if (selectedCell1 && selectedCell2) {
        this.touchEnd(e.changedTouches[0]);
      }
    });
  }

  init() {
    this.start();
  }

  start() {
    let promise=[];
    MAP = MAP.map((col, x) => {
      return col.map((cell, y) => {
        if (cell === 1) {
          cell = new Cell(x, y);
          cell.pageY = CELL_WIDTH * -2;
          promise.push(cell.animateTo(cell.pageX, y * CELL_WIDTH,0.5));
        }
        return cell;
      });
    });
    window.MAP = MAP;
    Promise.all(promise).then(() => {
      // autoCheck = true;
      canTouch = true;
    })
    this.draw();
    // worker.postMessage({
    //   type:'start',
    //   data:true
    // });
  }

  draw() {
    let activeCell = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBg();
    _score.draw();
    cell_bg.draw();
    MAP.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          if (cell.active === false) {
            cell.draw();
          } else {
            activeCell = cell;
          }
        }
      });
    });
    if (autoCheck === true) {
      this.checkAllGroupCell();
      autoCheck = false;
    }
    // console.log(activeCell);
    if (activeCell) {
      activeCell.draw();
    }
    this.drawSocre();
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  drawBg() {
    if (bg) {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    } else {
      let image = wx.createImage();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        bg = image;
      }
      image.src = 'images/bg.png';
    }
  }

  drawSocre() {
    ctx.strokeStyle = '#fff';
    ctx.font = "30px Arial";
    ctx.fillText(score, 10, 30);
    ctx.strokeText(score, 10, 30)
  }

  touchStart({
    pageX,
    pageY
  }) {
    x1 = Math.floor((pageX - PAGE_OFFSET_X) / CELL_WIDTH);
    y1 = Math.floor((pageY - PAGE_OFFSET_Y) / CELL_WIDTH);
    pageX1 = pageX;
    pageY1 = pageY;
    selectedCell1 = MAP[x1][y1];
  }

  touchMove({
    pageX,
    pageY
  }) {
    let direction;
    let offsetX1 = 0;
    let offsetY1 = 0;
    let offsetX2 = 0;
    let offsetY2 = 0;
    let pageX2 = pageX;
    let pageY2 = pageY;
    if (!selectedCell1) return;
    selectedCell1.active = true;
    direction = this._swipeDirection(pageX1, pageX2, pageY1, pageY2);
    if (direction === 'Up' && y1 - 1 >= 0) {
      selectedCell2 = MAP[x1][y1 - 1];
      offsetY1 = Math.max(pageY2 - pageY1, CELL_WIDTH * -1 + 1);
      offsetY2 = Math.min(pageY1 - pageY2, CELL_WIDTH - 1);
    } else if (direction === 'Down' && y1 + 1 < ROW) {
      selectedCell2 = MAP[x1][y1 + 1];
      offsetY1 = Math.min(pageY2 - pageY1, CELL_WIDTH - 1);
      offsetY2 = Math.max(pageY1 - pageY2, CELL_WIDTH * -1 + 1);
    } else if (direction === 'Right' && x1 + 1 < COL) {
      selectedCell2 = MAP[x1 + 1][y1];
      offsetX1 = Math.min(pageX2 - pageX1, CELL_WIDTH - 1);
      offsetX2 = Math.max(pageX1 - pageX2, CELL_WIDTH * -1 + 1);
    } else if (direction === 'Left' && x1 - 1 >= 0) {
      selectedCell2 = MAP[x1 - 1][y1];
      offsetX1 = Math.max(pageX2 - pageX1, CELL_WIDTH * -1 + 1);
      offsetX2 = Math.min(pageX1 - pageX2, CELL_WIDTH - 1);
    }
    selectedCell1.move(offsetX1, offsetY1);
    if (selectedCell2) {
      selectedCell2.move(offsetX2, offsetY2);
      if (lastSelectedCell2 && lastSelectedCell2.id !== selectedCell2.id) {
        lastSelectedCell2.reset();
      }
      lastSelectedCell2 = selectedCell2;
    }
  }

  touchEnd() {
    let {
      x,
      y,
      pageX,
      pageY
    } = selectedCell1;
    let boundary = CELL_WIDTH / 3;
    if (Math.abs(x * CELL_WIDTH - pageX) > boundary || Math.abs(y * CELL_WIDTH - pageY) > boundary) {
      this.checkChanged();
    } else {
      this.reset();
    }
  }

  reset() {
    selectedCell1.reset();
    selectedCell1.active = false;
    if (selectedCell2) {
      selectedCell2.reset();
    }
    selectedCell1 = selectedCell2 = null;
  }

  checkChanged() {
    let col1;
    let col2;
    let {
      x: x1,
      y: y1
    } = selectedCell1;
    let {
      x: x2,
      y: y2
    } = selectedCell2;
    MAP[x1][y1] = selectedCell2;
    MAP[x2][y2] = selectedCell1;
    selectedCell1.x = x2;
    selectedCell1.y = y2;
    selectedCell2.x = x1;
    selectedCell2.y = y1;
    let groupCells1 = this.findGoupCellsByCell(selectedCell1);
    let groupCells2 = this.findGoupCellsByCell(selectedCell2);
    if (groupCells1.length || groupCells2.length) {
      if (groupCells1.length >= 4) {
        placeholders.push({
          x: x2,
          y: y2,
          type: selectedCell1.type,
          bombType: this.checkGroupCellsDirection(groupCells1)
        });
      }
      if (groupCells2.length >= 4) {
        placeholders.push({
          x: x1,
          y: y1,
          type: selectedCell2.type,
          bombType: this.checkGroupCellsDirection(groupCells2)
        });
      }
      this.reset();
      this.removeCell([groupCells1, groupCells2]);
      _score.decrease();
    } else {
      MAP[x1][y1] = selectedCell1;
      MAP[x2][y2] = selectedCell2;
      selectedCell1.x = x1;
      selectedCell1.y = y1;
      selectedCell2.x = x2;
      selectedCell2.y = y2;
      this.reset();
    }
  }

  checkGroupCellsDirection(cells) {
    let {
      x: x1
    } = cells[0];
    let {
      x: x2
    } = cells[1];
    // direction  1=>横向 2=纵向
    return x1 === x2 ? 2 : 1;
  }

  findGoupCellsByCell(cell) {
    let {
      x,
      y,
      type
    } = cell;
    let result = [];
    let cellsX = [];
    let cellsY = [];
    let i = y;
    while (MAP[x][--i] && MAP[x][i] && MAP[x][i].type === type) {
      cellsY.push(MAP[x][i]);
    }
    i = y;
    while (MAP[x][++i] && MAP[x][i] && MAP[x][i].type === type) {
      cellsY.push(MAP[x][i]);
    }
    i = x;
    while (MAP[--i] && MAP[i][y] && MAP[i][y].type === type) {
      cellsX.push(MAP[i][y]);
    }
    i = x;
    while (MAP[++i] && MAP[i][y] && MAP[i][y].type === type) {
      cellsX.push(MAP[i][y]);
    }
    if (cellsX.length >= 2) {
      result = result.concat(cellsX);
    }

    if (cellsY.length >= 2) {
      result = result.concat(cellsY);
    }
    result.push(cell);
    return result.length >= 3 ? result : [];
  }

  findGoupCellsByLine(line) {
    let lastType = null;
    let lastComboIndex = 0;
    let result = [];
    let cells = [];
    line.forEach((cell, x) => {
      if (cell !== 0) {
        if (lastType === cell.type || lastType === null) {
          cells.push(cell);
          lastType = cell.type;
        } else if (cells.length >= 3) {
          result.push(cells);
          cells = [cell];
          lastType = cell.type;
        } else {
          cells = [cell];
          lastType = cell.type;
        }
      } else {
        lastType = -1;
      }
    });
    return result;
  }

  checkAllGroupCell() {
    let list = [];
    canTouch = false;
    MAP.forEach(col => {
      this.findGoupCellsByLine(col).forEach(cells => {
        let len = cells.length;
        if (len >= 3) {
          if (len >= 4) {
            holders.push({});
          }
        }
      });
    });

    for (let x = 0; x < ROW; x++) {
      let row = [];
      for (let y = 0; y < COL; y++) {
        row.push(MAP[y][x]);
      }
      let cells = this.findGoupCellsByLine(row);
      if (cells.length) {
        list.push(cells);
      }
    }
    if (list.length) {
      this.removeCell(list);
    }
    canTouch = true;
  }

  removeCell(list, noScore = true) {
    let hasBomb = null;
    list.forEach(cells => {
      cells.forEach(cell => {
        if (cell.moving === false) {
          cell.remove();
        }
        if (cell.isBomb === true) {
          cell.isBomb = false;
          hasBomb = cell.type;
        }
      });
      audio.playBoom(combo);
      if (noScore === true) {
        this.calcScore(cells.length, combo);
      }
    });
    if (hasBomb) {
      this.bombFire(hasBomb);
    }
    if (combo < 4) {
      combo++;
    }
    if (comboTimer) {
      clearTimeout(comboTimer);
    }
    comboTimer = setTimeout(() => {
      combo = 0;
    }, 2000);
    placeholders.forEach(({
      x,
      y,
      type,
      bombType
    }) => {
      MAP[x][y] = new Cell(x, y, bombType, type);
    });
    setTimeout(() => {
      this.supply();
    }, 500);
  }

  bombFire(type) {
    let result = [];
    MAP.forEach(col => {
      col.forEach(cell => {
        if (cell.type === type && cell.deaded === false) {
          result.push(cell);
        }
      });
    });
    if (result.length) {
      this.removeCell([result], false);
    }
  }

  supply() {
    canTouch = false;
    MAP.forEach((col, x) => {
      let moveStep = 0;
      for (let i = col.length - 1; i >= 0; i--) {
        let cell = col[i];
        if (cell) {
          if (cell.deaded === true) {
            moveStep++;
            col.splice(i, 1, false);
          } else if (moveStep > 0) {
            let topCell = col.splice(i, 1, false)[0];
            let y = i + moveStep;
            topCell.y = y;
            col.splice(y, 1, topCell);
            cell.animateTo(topCell.pageX, topCell.y * CELL_WIDTH, 0.5);
          }
        }
      }
      col.forEach((cell, y) => {
        if (cell === false) {
          let newCell = new Cell(x, y);
          newCell.pageY = CELL_WIDTH * -1;
          col.splice(y, 1, newCell);
          newCell.animateTo(newCell.pageX, newCell.y * CELL_WIDTH, 0.5);
          audio.playDown();
        }
      });
    });
    setTimeout(() => {
      // autoCheck = true;
      canTouch = true;
    }, 500);
  }

  calcScore(_score = 0, combo = 0) {
    // console.log(_score, combo);
    score += _score + combo;
    level = Math.min(Math.ceil(score / LEVEL_NUM), MAX_LEVEL);
    // level = MAX_LEVEL;
  }

  _swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }
};

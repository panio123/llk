const ROW = 12;
const COL = 9;
const FPS = 50;
const CELL_WIDTH = canvas.width / COL;

const PAGE_OFFSET_X = (canvas.width - (CELL_WIDTH * COL)) / 2;
const PAGE_OFFSET_Y = (canvas.height - (CELL_WIDTH * ROW))/2;

export default {
  COL,
  ROW,
  FPS,
  CELL_WIDTH,
  PAGE_OFFSET_X,
  PAGE_OFFSET_Y,
  MAX_LEVEL:10,
  LEVEL_NUM:300
};
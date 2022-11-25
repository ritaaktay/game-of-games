const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");
const CanvasDisplay = require("./lib/canvasDisplay");
const MiniGameLocator = require("./lib/miniGameLocator");
const Game = require("./lib/game");
const JumpGame = require("./lib/jumpGame");
const MatrixGame = require("./lib/matrixGame");

const level = new Level(
  levelPlans,
  new MiniGameLocator([JumpGame, MatrixGame])
);
const game = new Game(level, CanvasDisplay);

game.run();

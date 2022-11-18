const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");
const CanvasDisplay = require("./lib/canvasDisplay");
const MiniGameContainer = require("./lib/miniGameContainer");
const Game = require("./lib/game");

const level = new Level(levelPlans[0], MiniGameContainer);
const game = new Game(level, CanvasDisplay, Level);

game.run();

const level = new Level(levelPlan, new MiniGameContainer(Tetris, Pong, Snake));

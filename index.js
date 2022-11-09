const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");
const CanvasDisplay = require("./lib/canvasDisplay");
const Game = require("./lib/game");

const level = new Level(levelPlans[0]);
const game = new Game(level, CanvasDisplay, Level);

game.run();

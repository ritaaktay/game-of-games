const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");
const CanvasDisplay = require("./lib/canvasDisplay");
const MiniGameLocator = require("./lib/miniGameLocator");
const Game = require("./lib/game");

const level = new Level(levelPlans, MiniGameLocator);
const game = new Game(level, CanvasDisplay);

game.run();

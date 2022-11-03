const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");
const DOMDisplay = require("./lib/DOMDisplay");
const Game = require("./lib/game");
const BlockJumpGame = require("./lib/blockJumpGame");
const DumbMiniGame = require("./lib/dumbMiniGame");

const level = new Level(levelPlans[0]);
const game = new Game(level, DOMDisplay);
game.run();

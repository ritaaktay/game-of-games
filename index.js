const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");
const DOMDisplay = require("./lib/DOMDisplay");
const Game = require("./lib/game");
const BlockJumpGame = require("./lib/blockJumpGame");
const DumbMiniGame = require("./lib/dumbMiniGame");

const level = new Level(levelPlans[0]);
const game = new Game(level, DOMDisplay);
game.run();

const dumbGame = new DumbMiniGame();

const callbackFunction = (message) => console.log(message);
dumbGame.run(callbackFunction);

// const blockJumpGame = new BlockJumpGame((message) => console.log(message));

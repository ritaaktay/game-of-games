const BlockJumpGame = require("./blockJumpGame");
const MatrixGame = require("./matrixGame");

// each level can have it's own game creator with games
// each CookieJar can have a GameCreator of that level
// and create it's game based on the index in the levelPlan string

class GameCreator {
  constructor(games) {
    this.games = games;
  }

  // this index will correspond to the number on the level plan
  createGame = (index) => {
    const Game = new this.games[index]();
    return new Game();
  };
}

module.exports = GameCreator;

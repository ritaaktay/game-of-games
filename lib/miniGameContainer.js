const BlockJumpGame = require("./blockJumpGame");
const MatrixGame = require("./matrixGame");

class MiniGameContainer {
  constructor() {
    this.games = [BlockJumpGame, MatrixGame];
    this.assigned = [];
  }

  getGame() {
    const index = this.#getRandomIndex();
    const game = this.games[index];
    this.assigned.push(game);
    this.games.splice(index, 1);
    return game;
  }

  #getRandomIndex() {
    if (this.games.length < 1) {
      throw Error("No more mini-games left to assign!");
    }
    return Math.floor(Math.random() * this.games.length);
  }
}

module.exports = MiniGameContainer;

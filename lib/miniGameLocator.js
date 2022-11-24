const JumpGame = require("./jumpGame");
const MatrixGame = require("./matrixGame");

class MiniGameLocator {
  constructor() {
    this.games = [JumpGame, MatrixGame];
  }

  getGame() {
    const index = this.#getRandomIndex();
    const game = this.games[index];
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

module.exports = MiniGameLocator;

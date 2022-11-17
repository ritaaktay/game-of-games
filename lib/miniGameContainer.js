const BlockJumpGame = require("./blockJumpGame");
const MatrixGame = require("./matrixGame");

class MiniGameContainer {
  static #games = [BlockJumpGame, MatrixGame];
  static #assigned = [];

  static getGame() {
    const index = this.#getRandomIndex();
    const game = this.#games[index];
    this.#assigned.push(game);
    this.#games.splice(index, 1);
    return game;
  }

  static #getRandomIndex() {
    if (this.#games.length < 1) {
      throw Error("No more mini-games left to assign!");
    }
    return Math.floor(Math.random() * this.#games.length);
  }
}

module.exports = MiniGameContainer;

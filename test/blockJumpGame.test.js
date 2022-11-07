/**
 * @jest-environment jsdom
 */

const BlockJumpGame = require("../lib/blockJumpGame");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
});

describe("BlockJumpGame", () => {
  it("has character, a block, a jump button, a start button, and a jump counter initialized to 0", () => {
    const game = new BlockJumpGame();
    expect(game.character).toEqual(document.getElementById("character"));
    expect(game.block).toEqual(document.getElementById("block"));
    expect(game.jumpButton).toEqual(document.getElementById("jump-button"));
    expect(game.startButton).toEqual(document.getElementById("start-button"));
    expect(game.jumpCounter).toEqual(0);
  });
});

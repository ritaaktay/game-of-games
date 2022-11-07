/**
 * @jest-environment jsdom
 */

const BlockJumpGame = require("../lib/blockJumpGame");
const fs = require("fs");

beforeEach(() => {
  const document = fs.readFileSync(path.join(__dirname, "..", "index.html"));
});

describe("BlockJumpGame", () => {
  it("has character, a block, a jump button, a start button, and a jump counter initialized to 0", () => {
    const game = new BlockJumpGame();
    expect(game.character).toEqual(document.getElementById("character"));
  });
});

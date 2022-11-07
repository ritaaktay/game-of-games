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

  it("start button animates the block", () => {
    const game = new BlockJumpGame();
    document.getElementById("start-button").click();
    const block = document.getElementById("block");
    expect(block.style.animation).toEqual("block 1s infinite linear");
  });

  it("jump button makes character jump", () => {
    const game = new BlockJumpGame();
    document.getElementById("jump-button").click();
    const character = document.getElementById("character");
    expect(character.classList[0]).toEqual("animate");
  });

  it("jump button increments jump counter", () => {
    const game = new BlockJumpGame();
    document.getElementById("jump-button").click();
    expect(game.jumpCounter).toEqual(1);
  });

  it("jump button increments jump counter", () => {
    const game = new BlockJumpGame();
    document.getElementById("jump-button").click();
    document.getElementById("jump-button").click();
    document.getElementById("jump-button").click();
    document.getElementById("jump-button").click();
    expect(game.jumpCounter).toEqual(4);
  });

  it("animation is removed 500 ms after jump button is clicked", (done) => {
    const game = new BlockJumpGame();
    document.getElementById("jump-button").click();
    const character = document.getElementById("character");
    expect(character.classList[0]).toEqual("animate");
    setTimeout(() => {
      expect(character.classList.keys.length).toEqual(0);
      done();
    }, 600);
  });

  it("takes a callback", () => {
    const game = new BlockJumpGame();
    const mockCallback = jest.fn().mockImplementation((callback) => {});
    game.run(mockCallback);
    expect(game.callback).toEqual(mockCallback);
  });

  it("run method displays game", () => {
    const game = new BlockJumpGame();
    const mockCallback = jest.fn().mockImplementation((callback) => {});
    game.run(mockCallback);
    const container = document.getElementById("block_jump_game_container");
    expect(container.style.display).toEqual("inline");
  });
});

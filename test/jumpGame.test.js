/**
 * @jest-environment jsdom
 */

const JumpGame = require("../lib/jumpGame");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
});

describe("JumpGame", () => {
  it("has character, a block, and a jump counter initialized to 0", () => {
    const game = new JumpGame();
    expect(game.character).toEqual(document.getElementById("character"));
    expect(game.block).toEqual(document.getElementById("block"));
    expect(game.jumpCounter).toEqual(0);
    expect(game.started).toEqual(false);
  });

  it("start button animates the block", () => {
    const game = new JumpGame();
    game.run((result) => {});
    const event = new KeyboardEvent("keydown", { "key": "Enter" });
    window.dispatchEvent(event);
    const block = document.getElementById("block");
    expect(block.style.animation).toEqual("block 1s infinite linear");
  });

  it("jump button makes character jump", () => {
    const game = new JumpGame();
    game.run((result) => {});
    game.start();
    const event = new KeyboardEvent("keydown", { "key": " " });
    window.dispatchEvent(event);
    const character = document.getElementById("character");
    expect(character.classList[0]).toEqual("animate");
  });

  it("jump button increments jump counter", () => {
    const game = new JumpGame();
    game.run((result) => {});
    game.start();
    const event = new KeyboardEvent("keydown", { "key": " " });
    window.dispatchEvent(event);
    expect(game.jumpCounter).toEqual(1);
  });

  it("jump button increments jump counter", (done) => {
    const game = new JumpGame();
    game.start();
    const jumpLater = () => {
      setTimeout(() => {
        game.jump();
        jumpLater();
      }, 550);
    };
    jumpLater();
    setTimeout(() => {
      expect(game.jumpCounter).toEqual(4);
      done();
    }, 2400);
  });

  it("animation is removed 500 ms after jump button is clicked", (done) => {
    const game = new JumpGame();
    game.run((result) => {});
    const event = new KeyboardEvent("keydown", { "key": " " });
    window.dispatchEvent(event);
    const character = document.getElementById("character");
    expect(character.classList[0]).toEqual("animate");
    setTimeout(() => {
      expect(character.classList.keys.length).toEqual(0);
      done();
    }, 600);
  });

  it("takes a callback", () => {
    const game = new JumpGame();
    const mockCallback = jest.fn().mockImplementation((callback) => {});
    game.run(mockCallback);
    expect(game.callback).toEqual(mockCallback);
  });

  it("run method displays game", () => {
    const game = new JumpGame();
    const mockCallback = jest.fn().mockImplementation((callback) => {});
    game.run(mockCallback);
    const container = document.getElementById("block_jump_game_container");
    expect(container.style.display).toEqual("inline");
  });

  it("run method calls checkIfDead()", () => {
    const game = new JumpGame();
    const mockCallback = jest.fn().mockImplementation((callback) => {});
    const spy = jest.spyOn(game, "checkIfDead");
    game.run(mockCallback);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("game is lost on contact with block", (done) => {
    const game = new JumpGame();
    const originalGetComputedStyle = window.getComputedStyle;
    const mockLoseCallback = jest.fn().mockImplementation((message) => {
      expect(message).toEqual("lost");
      window.getComputedStyle = originalGetComputedStyle;
      done();
    });
    Object.defineProperty(window, "getComputedStyle", {
      value: () => ({
        getPropertyValue: (property) => {
          if (property == "top") return 300;
          if (property == "left") return 15;
        },
      }),
    });
    game.run(mockLoseCallback);
    game.start();
  });

  it("game is won 500ms after 5 jumps", (done) => {
    const game = new JumpGame();
    const mockWinCallback = jest.fn().mockImplementation((message) => {
      expect(message).toEqual("won");
      done();
    });
    game.run(mockWinCallback);
    game.start();
    let counter = 0;
    const jumpLater = () => {
      setTimeout(() => {
        game.jump();
        if (counter > 4) return;
        jumpLater();
      }, 550);
    };
    jumpLater();
  });
});

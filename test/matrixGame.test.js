/**
 * @jest-environment jsdom
 */

const MatrixGame = require("../lib/matrixGame");
const fs = require("fs");
const path = require("path");
const { doesNotMatch } = require("assert");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
  game = new MatrixGame();
});

describe("MatrixGame", () => {
  it("has a background image and an image of 2 pills", () => {
    expect(game.image).toEqual(document.getElementById("matrix"));
    expect(game.pills).toEqual(document.getElementById("pills"));
  });

  it(".run() displays message and images", () => {
    game.run((callback) => {});

    expect(document.getElementById("text").textContent).toEqual(
      "Make your choice. Press [R] for the red pill, [B] for the blue pill."
    );
    expect(game.image.style.display).toEqual("inline");
    expect(game.pills.style.display).toEqual("inline");
  });

  it(".end() removes images", () => {
    game.run((callback) => {});
    game.end();
    expect(game.image.style.display).toEqual("none");
    expect(game.pills.style.display).toEqual("none");
  });

  it("displays messages to screen", () => {
    game.displayMessage("You won! 🍪");
    expect(document.getElementById("text").textContent).toEqual("You won! 🍪");
  });

  it("calls callback with 'Won' and ends game when 'r' is pressed", (done) => {
    const mockCallback = jest.fn().mockImplementation((result) => {
      expect(result).toEqual("Won");
      expect(spy).toHaveBeenCalled();
      expect(game.image.style.display).toEqual("none");
      expect(game.pills.style.display).toEqual("none");
      done();
    });
    const spy = jest.spyOn(game, "end");
    game.run(mockCallback);

    const event = new KeyboardEvent("keydown", { "key": "r" });
    window.dispatchEvent(event);
  });

  it("calls callback with 'Lost' and ends game when 'b' is pressed", (done) => {
    const mockCallback = jest.fn().mockImplementation((result) => {
      expect(result).toEqual("Lost");
      expect(spy).toHaveBeenCalled();
      expect(game.image.style.display).toEqual("none");
      expect(game.pills.style.display).toEqual("none");
      done();
    });
    const spy = jest.spyOn(game, "end");
    game.run(mockCallback);

    const event = new KeyboardEvent("keydown", { "key": "b" });
    window.dispatchEvent(event);
  });
});

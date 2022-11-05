/**
 * @jest-environment jsdom
 */
const Game = require("../lib/game");
const DOMDisplay = require("../lib/DOMDisplay");
const Level = require("../lib/level");
const State = require("../lib/state");
const levelPlans = require("../lib/levelPlans");
jest.mock("../lib/DOMDisplay.js");

describe("Game", () => {
  it("has a level, a display, a state and an arrow keys tracker", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    expect(game.level).toEqual(level);
    expect(game.display instanceof DOMDisplay).toBe(true);
    expect(game.state instanceof State).toEqual(true);
    expect(game.state.level).toEqual(level);
    expect(game.arrowKeysTracker).toEqual({});
  });

  it("runs the game", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const spy = jest.spyOn(window, "requestAnimationFrame");
    game.run();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it("runs the game with recursive calls to requestAnimationFrame", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback();
    });
    game.run();
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);
    mockRequestAnimationFrame.mockClear();
  });

  it("runs the game with recursive calls to requestAnimationFrame", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback();
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback();
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback();
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback();
    });
    game.run();
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(5);
    mockRequestAnimationFrame.mockClear();
  });

  it("runs the game with recursive calls to requestAnimationFrame and updates state", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    game.run();
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(5);
    mockRequestAnimationFrame.mockClear();
  });

  it.only("clears display when game is won or lost", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    const spy = jest.spyOn(game.display, "clear");
    game.state.status = "Won";
    console.log(game.state.status);
    game.run();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // 32-34: state.status is not "playing"

  // 58-60: track(event) callback to keydown & keyup
  // need to mock keydown & keyup events on arrow keys
});

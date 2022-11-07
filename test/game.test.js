/**
 * @jest-environment jsdom
 */
const Game = require("../lib/game");
const DOMDisplay = require("../lib/DOMDisplay");
const Level = require("../lib/level");
const State = require("../lib/state");
const levelPlans = require("../lib/levelPlans");
const fs = require("fs");
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

  it("clears display when game is won or lost", () => {
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
    game.run();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("tracks keyup and keydown events for arrow keys", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    const event = new KeyboardEvent("keydown", { "key": "ArrowDown" });
    const spy = jest.spyOn(event, "preventDefault");
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      window.dispatchEvent(event);
      callback(Date.now());
    });
    game.run();
    expect(spy).toHaveBeenCalled();
  });

  it("coverse else for line 58", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    const event = new KeyboardEvent("keydown", { "key": "Esc" });
    const spy = jest.spyOn(event, "preventDefault");
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      window.dispatchEvent(event);
      callback(Date.now());
    });
    game.run();
    expect(spy).not.toHaveBeenCalled();
  });
});

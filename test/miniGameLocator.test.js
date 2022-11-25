const MiniGameLocator = require("../lib/miniGameLocator");

describe("MiniGameLocator", () => {
  it("has an array of games", () => {
    const miniGameLocator = new MiniGameLocator([]);
    expect(miniGameLocator.games).toEqual([]);
  });

  it("has a get game method", () => {
    const MockGame = {};
    const miniGameLocator = new MiniGameLocator([MockGame]);
    expect(miniGameLocator.getGame()).toEqual(MockGame);
  });

  it("throws an error if no more games left", () => {
    const MockGame = {};
    const miniGameLocator = new MiniGameLocator([MockGame]);
    miniGameLocator.getGame();
    expect(() => {
      miniGameLocator.getGame();
    }).toThrow(new Error("No more mini-games left to assign!"));
  });
});

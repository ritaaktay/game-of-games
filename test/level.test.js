const Vec = require("../lib/vector");
const Level = require("../lib/level");
const MiniGameLocator = require("../lib/miniGameLocator");
const mockLevelPlans = require("./mockLevelPlans");

beforeEach(() => {
  miniGameLocator = new MiniGameLocator([{}, {}]);
});

describe("Level", () => {
  it("creates an array of arrays representing a given level plan", () => {
    const level = new Level(mockLevelPlans, miniGameLocator);

    expect(level.height).toEqual(9);
    expect(level.width).toEqual(18);
    expect(level.startActors[0].type).toEqual("cookieJar");
    expect(level.startActors[1].type).toEqual("player");
    expect(level.startActors[2].type).toEqual("cookieJar");
    expect(level.rows.length).toEqual(9);

    for (let i = 0; i < level.rows.length; i++) {
      expect(level.rows[i].length).toEqual(18);
    }

    for (let a = 0; a < level.rows.length; a++) {
      for (let b = 0; b < level.rows[a].length; b++) {
        expect(level.rows[a][b]).toEqual("empty");
      }
    }
  });

  it("touchesWall() checks if an actor is touching a wall", () => {
    const level = new Level(mockLevelPlans, miniGameLocator);

    actor1 = {
      pos: new Vec(5, 5),
      size: new Vec(1, 1),
    };

    let result1 = level.touchesWall(actor1.pos, actor1.size, "wall");
    expect(result1).toEqual(false);

    actor2 = {
      pos: new Vec(-5, -5),
      size: new Vec(1, 1),
    };
    const result2 = level.touchesWall(actor2.pos, actor2.size, "wall");
    expect(result2).toEqual(true);
  });

  it("switches between different level plans at game stage", () => {
    const level = new Level(mockLevelPlans, miniGameLocator);
    const spy = jest.spyOn(level, "makeMatrix");
    const escapeLevel = level.switch("escape");
    expect(spy).toHaveBeenCalledWith(mockLevelPlans["escape"]);
  });
});

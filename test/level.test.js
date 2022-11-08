const Vec = require("../lib/vector");
const mockLevelPlan = require("./mockLevelPlan1");
const Level = require("../lib/level");

// Future: use mocks to convert this to pure unit testing

describe("Level", () => {
  it("creates an array of arrays representing a given level plan", () => {
    const level = new Level(mockLevelPlan);

    expect(level.height).toEqual(9);
    expect(level.width).toEqual(18);
    expect(level.startActors[0].type).toEqual("player");
    expect(level.startActors[1].type).toEqual("cookieJar1");
    expect(level.rows.length).toEqual(9);

    // Assert number of elements in each child array
    for (let i = 0; i < level.rows.length; i++) {
      expect(level.rows[i].length).toEqual(18);
    }

    // Assert value of each element in each child array
    for (let a = 0; a < level.rows.length; a++) {
      for (let b = 0; b < level.rows[a].length; b++) {
        expect(level.rows[a][b]).toEqual("empty");
      }
    }
  });

  it("touchesElement() checks if an actor is touching a given element of the game's level plan", () => {
    const level = new Level(mockLevelPlan);

    // An actor within the game's boundaries
    actor1 = {
      pos: new Vec(5, 5),
      size: new Vec(1, 1),
    };

    // Assert the actor is not touching the level plan's boundary
    let result1 = level.touchesElement(actor1.pos, actor1.size, "wall");
    expect(result1).toEqual(false);

    // An actor outside of the game's boundaries
    actor2 = {
      pos: new Vec(-5, -5),
      size: new Vec(1, 1),
    };
    // Assert an actor is touching (or is inside) the level plan's boundary
    const result2 = level.touchesElement(actor2.pos, actor2.size, "wall");
    expect(result2).toEqual(true);
  });
});

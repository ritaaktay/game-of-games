const Vec = require("../../lib/vector");
const levelPlans = require("../../lib/levelPlans");
const Level = require("../../lib/level");

describe("Level", () => {
  it("creates an array of arrays representing a given level plan", () => {
    const level = new Level(levelPlans[0]);

    expect(level.height).toEqual(9);
    expect(level.width).toEqual(18);
    expect(level.startActors[0].type).toEqual("player");
    expect(level.startActors[1].type).toEqual("cookieJar");

    expect(level.rows.length).toEqual(9);
    expect(level.rows.length).toEqual(9);

    expect(level.rows[0].length).toEqual(18);

    // Future: do a new loop to test the full array of arrays in one go

    // Expect each element in a row to be the string "empty"

    // row 1
    for (let i = 0; i < level.rows[0].length; i++) {
      expect(level.rows[0][i]).toEqual("empty");
    }
    // row 2
    for (let i = 0; i < level.rows[1].length; i++) {
      expect(level.rows[1][i]).toEqual("empty");
    }
    // row 3
    for (let i = 0; i < level.rows[2].length; i++) {
      expect(level.rows[2][i]).toEqual("empty");
    }
    // row 4
    for (let i = 0; i < level.rows[3].length; i++) {
      expect(level.rows[3][i]).toEqual("empty");
    }
    // row 5
    for (let i = 0; i < level.rows[4].length; i++) {
      expect(level.rows[4][i]).toEqual("empty");
    }
    // row 6
    for (let i = 0; i < level.rows[5].length; i++) {
      expect(level.rows[5][i]).toEqual("empty");
    }
    // row 7
    for (let i = 0; i < level.rows[6].length; i++) {
      expect(level.rows[6][i]).toEqual("empty");
    }
    // row 8
    for (let i = 0; i < level.rows[7].length; i++) {
      expect(level.rows[7][i]).toEqual("empty");
    }
    // row 9
    for (let i = 0; i < level.rows[8].length; i++) {
      expect(level.rows[8][i]).toEqual("empty");
    }
  });

  it("touchesElement() checks if an actor is touching a given element of the game's level plan", () => {
    const level = new Level(levelPlans[0]);

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
    // Assert an actor is touching the level plan's boundary
    const result2 = level.touchesElement(actor2.pos, actor2.size, "wall");
    expect(result2).toEqual(true);
  });
});

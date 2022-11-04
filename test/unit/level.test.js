const Vec = require("../../lib/vector");
const levelPlans = require("../../lib/levelPlans");
const Level = require("../../lib/level");

describe("Level", () => {
  it("creates an array of arrays representing a given level plan", () => {
    const level = new Level(levelPlans[0]);
    expect(level.height).toEqual(9);
    expect(level.width).toEqual(18);
    console.log(level.startActors);
    expect(level.startActors[0].type).toEqual("player");
    expect(level.startActors[1].type).toEqual("cookieJar");
    console.log(level);
  });
});

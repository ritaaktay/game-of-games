const Vec = require("../lib/vector");

describe("Vec", () => {
  it("stores the x and y coordinates of a game actor / object", () => {
    const vec = new Vec(1, 2);

    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(2);
  });
  it("plus()", () => {
    const vec1 = new Vec(1, 2);
    const vec2 = new Vec(3, 4);

    expect(vec1.plus(vec2).x).toEqual(4);
    expect(vec1.plus(vec2).y).toEqual(6);
  });
  it("times()", () => {
    const vec1 = new Vec(1, 2);

    expect(vec1.times(2).x).toEqual(2);
    expect(vec1.times(2).y).toEqual(4);
  });
});

/**
 * @jest-environment jsdom
 */

const CookieMonster = require("../lib/cookieMonster");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const levelPlans = require("../lib/levelPlans");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
  cookieMonster = new CookieMonster(new Vec(0, 0), new Vec(0, 0));
});

describe("CookieMonster", () => {
  it("has a position vector, a speed vector", () => {
    expect(cookieMonster.pos.x).toEqual(0);
    expect(cookieMonster.pos.y).toEqual(0);
    expect(cookieMonster.speed.x).toEqual(0);
    expect(cookieMonster.speed.y).toEqual(0);
  });

  it("has a getter for type", () => {
    expect(cookieMonster.type).toEqual("cookieMonster");
  });

  it("has a create method", () => {
    expect(cookieMonster.pos.x).toEqual(0);
    expect(cookieMonster.pos.y).toEqual(0);
    expect(cookieMonster.speed.x).toEqual(0);
    expect(cookieMonster.speed.y).toEqual(0);
  });

  it("has default size", () => {
    // Using CookieMonster.prototype.size
    const cookieMonster1 = CookieMonster.create(new Vec(0, 0));
    expect(cookieMonster1.size).toEqual(new Vec(1, 1));
  });

  it("has an updated method that returns a new and identical CookieMonster", () => {
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const newCookieMonster = cookieMonster.update();
    expect(newCookieMonster.pos).toEqual(new Vec(0, 0));
    expect(newCookieMonster.speed).toEqual(new Vec(0, 0));
  });

  it(".collide() displays message to user based on number of cookies obtained by player", () => {
    const level = new Level(levelPlans[0]);

    // cookieJar1Cookie = 0; cookieJar2Cookie = 0
    const state1 = new State(level, [], "playing", null, 0, 0);
    cookieMonster.collide(state1);
    expect(document.getElementById("text").textContent).toEqual(
      "Give me cookies!"
    );

    // cookieJar1Cookie = 1; cookieJar2Cookie = 0
    const state2 = new State(level, [], "playing", null, 1, 0);
    cookieMonster.collide(state2);
    expect(document.getElementById("text").textContent).toEqual(
      "Give me cookies!"
    );

    // cookieJar1Cookie = 1; cookieJar2Cookie = 1
    const state3 = new State(level, [], "playing", null, 1, 1);
    cookieMonster.collide(state3, Level);
    expect(document.getElementById("text").textContent).toEqual(
      "Thanks! Now, escape before it's too late!"
    );
  });
});

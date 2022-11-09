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
});

describe("CookieMonster", () => {
  it("has a position vector, a speed vector and a default null updatedState", () => {
    const cookieMonster = new CookieMonster(new Vec(0, 0), new Vec(0, 0));
    expect(cookieMonster.pos.x).toEqual(0);
    expect(cookieMonster.pos.y).toEqual(0);
    expect(cookieMonster.speed.x).toEqual(0);
    expect(cookieMonster.speed.y).toEqual(0);
    expect(cookieMonster.updatedState).toEqual(null);
  });

  it("has a getter for type", () => {
    const cookieMonster = new CookieMonster(new Vec(0, 0), new Vec(0, 0));
    expect(cookieMonster.type).toEqual("cookieMonster");
  });

  it("has a create method", () => {
    const cookieMonster = CookieMonster.create(new Vec(0, 0));
    expect(cookieMonster.pos.x).toEqual(0);
    expect(cookieMonster.pos.y).toEqual(0);
    expect(cookieMonster.speed.x).toEqual(0);
    expect(cookieMonster.speed.y).toEqual(0);
    expect(cookieMonster.updatedState).toEqual(null);
  });

  it("has default size", () => {
    const cookieMonster = CookieMonster.create(new Vec(0, 0));
    expect(cookieMonster.size).toEqual(new Vec(1, 1));
  });

  it("has an updated method that returns a new and identical CookieMonster", () => {
    const cookieMonster = CookieMonster.create(new Vec(0, 0));
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const newCookieMonster = cookieMonster.update();
    expect(newCookieMonster.pos).toEqual(new Vec(0, 0));
    expect(newCookieMonster.speed).toEqual(new Vec(0, 0));
    expect(newCookieMonster.updatedState).toEqual(null);
  });

  // Revisit this when we want to make this behaviour different depending on state.miniGameStatus
  it(".collide() displays message to user ", () => {
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const cookieMonster = new CookieMonster(new Vec(0, 0), new Vec(0, 0), null);
    const newState = cookieMonster.collide(state);
    expect(document.getElementById("text").textContent).toEqual(
      "I am the Cookie Monster! Cookie from first jar, please!"
    );
  });
});

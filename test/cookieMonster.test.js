/**
 * @jest-environment jsdom
 */

const CookieMonster = require("../lib/cookieMonster");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const MiniGameLocator = require("../lib/miniGameLocator");
const levelPlans = require("../lib/levelPlans");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
  cookieMonster = new CookieMonster(new Vec(0, 0), new Vec(0, 0));
  miniGameLocator = new MiniGameLocator([
    () => {
      return { getGame: () => {} };
    },
    () => {
      return { getGame: () => {} };
    },
  ]);
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
    expect(cookieMonster.size).toEqual(new Vec(1, 1));
  });

  it(".collide() displays message to user based on number of cookies obtained by player", () => {
    const level = new Level(levelPlans, miniGameLocator);

    const state1 = new State(level, [], "playing", null);
    cookieMonster.collide(state1);
    expect(document.getElementById("text").textContent).toEqual(
      "Give me cookies!"
    );

    const state2 = new State(
      level,
      [
        { type: "cookieJar", cookies: 1 },
        { type: "cookieJar", cookies: 0 },
      ],
      "playing",
      null
    );
    cookieMonster.collide(state2);
    expect(document.getElementById("text").textContent).toEqual(
      "Give me more cookies! You have: 🍪"
    );

    const state3 = new State(
      level,
      [
        { type: "cookieJar", cookies: 1 },
        { type: "cookieJar", cookies: 1 },
      ],
      "playing",
      null
    );
    cookieMonster.collide(state3, Level);
    expect(document.getElementById("text").textContent).toEqual(
      "Mmmm delicious! Now, escape before it's too late!"
    );

    const state4 = new State(
      level,
      [
        { type: "cookieJar", cookies: 44 },
        { type: "cookieJar", cookies: 88 },
      ],
      "playing",
      null
    );
    cookieMonster.collide(state4, Level);
    expect(document.getElementById("text").textContent).toEqual(
      "Mmmm delicious! Now, escape before it's too late!"
    );
  });
});

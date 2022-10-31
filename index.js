const Level = require("./lib/level");
const State = require("./lib/state");
const DOMDisplay = require("./lib/DOMDisplay");
const levelPlans = require("./lib/levelPlans");

let level = new Level(levelPlans[0]);
let display = new DOMDisplay(document.body, level);
display.syncState(State.start(level));

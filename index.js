const Level = require("./lib/level");
const levelPlans = require("./lib/levelPlans");

const level = new Level(levelPlans[0]);
console.log(level.startActors[0].pos);

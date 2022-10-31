(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // lib/vector.js
  var require_vector = __commonJS({
    "lib/vector.js"(exports, module) {
      var Vec = class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        plus(other) {
          return new Vec(this.x + other.x, this.y + other.y);
        }
        times(factor) {
          return new Vec(this.x * factor, this.y * factor);
        }
      };
      module.exports = Vec;
    }
  });

  // lib/player.js
  var require_player = __commonJS({
    "lib/player.js"(exports, module) {
      var Vec = require_vector();
      var Player = class {
        constructor(pos, speed) {
          this.pos = pos;
          this.speed = speed;
        }
        get type() {
          return "player";
        }
        static create(pos) {
          return new Player(pos, new Vec(0, 0));
        }
      };
      Player.prototype.size = new Vec(1, 1);
      module.exports = Player;
    }
  });

  // lib/levelCharTypes.js
  var require_levelCharTypes = __commonJS({
    "lib/levelCharTypes.js"(exports, module) {
      var Player = require_player();
      var levelCharTypes = {
        ".": "empty",
        "@": Player
      };
      module.exports = levelCharTypes;
    }
  });

  // lib/level.js
  var require_level = __commonJS({
    "lib/level.js"(exports, module) {
      var Vec = require_vector();
      var levelCharTypes = require_levelCharTypes();
      var Level2 = class {
        constructor(plan) {
          let rows = plan.trim().split("\n").map((l) => [...l]);
          this.height = rows.length;
          this.width = rows[0].length;
          this.startActors = [];
          this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
              let type = levelCharTypes[ch];
              if (typeof type == "string")
                return type;
              this.startActors.push(type.create(new Vec(x, y)));
              return "empty";
            });
          });
        }
      };
      module.exports = Level2;
    }
  });

  // lib/state.js
  var require_state = __commonJS({
    "lib/state.js"(exports, module) {
      var State2 = class {
        constructor(level2, actors, status) {
          this.level = level2;
          this.actors = actors;
          this.status = status;
        }
        static start(level2) {
          return new State2(level2, level2.startActors, "playing");
        }
        get player() {
          return this.actors.find((a) => a.type == "player");
        }
      };
      module.exports = State2;
    }
  });

  // lib/DOMDisplay.js
  var require_DOMDisplay = __commonJS({
    "lib/DOMDisplay.js"(exports, module) {
      var DOMDisplay2 = class {
        constructor(parent, level2) {
          this.scale = 20;
          this.dom = this.#createElements(
            "div",
            { class: "game" },
            this.#drawGrid(level2)
          );
          this.actorLayer = null;
          parent.appendChild(this.dom);
        }
        clear() {
          this.dom.remove();
        }
        syncState(state) {
          if (this.actorLayer)
            this.actorLayer.remove();
          this.actorLayer = this.#drawActors(state.actors);
          this.dom.appendChild(this.actorLayer);
          this.dom.className = `game ${state.status}`;
          this.#scrollPlayerIntoView(state);
        }
        #drawGrid(level2) {
          console.log(this.scale);
          console.log(`${level2.width * this.scale}px`);
          return this.#createElements(
            "table",
            {
              class: "background",
              style: `width: ${level2.width * this.scale}px`
            },
            ...level2.rows.map(
              (row) => this.#createElements(
                "tr",
                { style: `height: ${this.scale}px` },
                ...row.map((type) => this.#createElements("td", { class: type }))
              )
            )
          );
        }
        #drawActors(actors) {
          return this.#createElements(
            "div",
            {},
            ...actors.map((actor) => {
              let rect = this.#createElements("div", {
                class: `actor ${actor.type}`
              });
              rect.style.width = `${actor.size.x * this.scale}px`;
              rect.style.height = `${actor.size.y * this.scale}px`;
              rect.style.left = `${actor.pos.x * this.scale}px`;
              rect.style.top = `${actor.pos.y * this.scale}px`;
              return rect;
            })
          );
        }
        #createElements(name, attrs, ...children) {
          let dom = document.createElement(name);
          for (let attr of Object.keys(attrs)) {
            dom.setAttribute(attr, attrs[attr]);
          }
          for (let child of children) {
            dom.appendChild(child);
          }
          return dom;
        }
        #scrollPlayerIntoView(state) {
          {
            let width = this.dom.clientWidth;
            let height = this.dom.clientHeight;
            let margin = width / 3;
            let left = this.dom.scrollLeft, right = left + width;
            let top = this.dom.scrollTop, bottom = top + height;
            let player = state.player;
            let center = player.pos.plus(player.size.times(0.5)).times(this.scale);
            if (center.x < left + margin) {
              this.dom.scrollLeft = center.x - margin;
            } else if (center.x > right - margin) {
              this.dom.scrollLeft = center.x + margin - width;
            }
            if (center.y < top + margin) {
              this.dom.scrollTop = center.y - margin;
            } else if (center.y > bottom - margin) {
              this.dom.scrollTop = center.y + margin - height;
            }
          }
        }
      };
      module.exports = DOMDisplay2;
    }
  });

  // lib/levelPlans.js
  var require_levelPlans = __commonJS({
    "lib/levelPlans.js"(exports, module) {
      var simpleLevelPlan = `
......................
......................
......................
......................
......................
......................
......................
......................
@.....................`;
      module.exports = [simpleLevelPlan];
    }
  });

  // index.js
  var Level = require_level();
  var State = require_state();
  var DOMDisplay = require_DOMDisplay();
  var levelPlans = require_levelPlans();
  var level = new Level(levelPlans[0]);
  var display = new DOMDisplay(document.body, level);
  display.syncState(State.start(level));
})();

class CanvasDisplay {
  constructor(parent, level) {
    this.scale = 40;

    // <canvas> element setup
    this.canvas = document.createElement("canvas");
    this.canvas.className = "main-game";
    // Level width = 18 * 40 = 720
    this.canvas.width = level.width * this.scale;
    // Level height = 9 * 40 = 360
    this.canvas.height = level.height * this.scale;

    // Add <canvas> element to <body>
    parent.appendChild(this.canvas);

    // "2d" context setup
    this.cx = this.canvas.getContext("2d");

    // cookieJar1Sprite set-up
    this.cookieJar1Sprite = document.createElement("img");
    this.cookieJar1Sprite.src = "../img/cookieJar1.png";

    // playerSprite set-up
    this.playerSprites = document.createElement("img");
    this.playerSprites.src = "../img/player.png";

    // wallSprite set-up
    this.wallSprite = document.createElement("img");
    this.wallSprite.src = "img/wall.png";

    // cookieMonsterSprite set-up
    this.cookieMonsterSprite = document.createElement("img");
    this.cookieMonsterSprite.src = "img/cookieMonster.png";

    this.drawBackground(level);
  }

  clear() {
    this.canvas.remove();
  }

  syncState(state) {
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
  }

  clearDisplay = function (status) {
    this.cx.fillStyle = "rgb(119, 255, 61)";
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  drawBackground = function (level) {
    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        let tile = level.rows[y][x];
        if (tile == "empty") {
          continue;
        } else if (tile == "wall") {
          this.cx.drawImage(
            this.wallSprite,
            x * this.scale,
            y * this.scale,
            this.scale,
            this.scale
          );
        } else if (tile == "CM") {
          this.cx.drawImage(
            this.cookieMonsterSprite,
            x * this.scale,
            y * this.scale,
            this.scale,
            this.scale
          );
        }
      }
    }
  };

  drawActors = function (actors) {
    for (let actor of actors) {
      let width = actor.size.x * this.scale;
      let height = actor.size.y * this.scale;
      let x = actor.pos.x * this.scale;
      let y = actor.pos.y * this.scale;
      if (actor.type == "player") {
        this.drawPlayer(actor, x, y, width, height);
      } else if (actor.type == "cookieJar1") {
        this.cx.drawImage(this.cookieJar1Sprite, x, y, this.scale, this.scale);
      }
    }
  };

  drawPlayer = function (player, x, y, width, height) {
    this.cx.drawImage(this.playerSprites, x, y, width, height);
  };
}

module.exports = CanvasDisplay;

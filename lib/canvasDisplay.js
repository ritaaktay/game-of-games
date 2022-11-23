class CanvasDisplay {
  constructor(parent, level) {
    this.scale = 40;
    this.parent = parent;
    this.addCanvas(level);
    this.#setSprites();
    this.drawBackground(level);
  }

  addCanvas(level) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "main-game";
    this.canvas.width = level.width * this.scale;
    this.canvas.height = level.height * this.scale;
    this.parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");
  }

  clear() {
    this.canvas.remove();
  }

  syncState(state) {
    if (state.miniGameStatus == "playing") {
      this.canvas.style.display = "none";
    } else {
      this.canvas.style.display = "inline";
      this.resetDisplay(state.status);
      this.drawBackground(state.level);
      this.drawActors(state.actors);
    }
  }

  resetDisplay = function (status) {
    let pattern = this.cx.createPattern(
      this.backgroundSprites[status],
      "repeat"
    );
    this.cx.fillStyle = pattern;
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
      } else if (actor.type == "cookieJar") {
        this.cx.drawImage(this.cookieJarSprite, x, y, this.scale, this.scale);
      } else if (actor.type == "exit") {
        this.cx.drawImage(this.exitSprite, x, y, this.scale, this.scale);
      } else if (actor.type == "cookieMonster") {
        this.cx.drawImage(
          this.cookieMonsterSprite,
          x,
          y,
          this.scale,
          this.scale
        );
      }
    }
  };

  drawPlayer = function (player, x, y, width, height) {
    this.cx.drawImage(this.playerSprites, x, y, width, height);
  };

  #setSprites = () => {
    this.cookieJarSprite = document.createElement("img");
    this.cookieJarSprite.src = "../img/cookieJar.png";

    this.playerSprites = document.createElement("img");
    this.playerSprites.src = "../img/player.png";

    this.wallSprite = document.createElement("img");
    this.wallSprite.src = "img/wall.png";

    this.cookieMonsterSprite = document.createElement("img");
    this.cookieMonsterSprite.src = "img/cookieMonster2.png";

    this.exitSprite = document.createElement("img");
    this.exitSprite.src = "img/diamond.png";

    const backgroundSprite = document.createElement("img");
    backgroundSprite.src = "img/background-tile.jpeg";

    const winBackgroundSprite = document.createElement("img");
    winBackgroundSprite.src = "img/clouds.jpeg";

    this.backgroundSprites = {
      "playing": backgroundSprite,
      "win": winBackgroundSprite,
    };
  };
}

module.exports = CanvasDisplay;

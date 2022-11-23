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
        if (tile == "empty") continue;
        this.cx.drawImage(
          this.backgroundSprites[tile],
          x * this.scale,
          y * this.scale,
          this.scale,
          this.scale
        );
      }
    }
  };

  drawActors = function (actors) {
    for (let actor of actors) {
      let width = actor.size.x * this.scale;
      let height = actor.size.y * this.scale;
      let x = actor.pos.x * this.scale;
      let y = actor.pos.y * this.scale;
      this.cx.drawImage(this.actorSprites[actor.type], x, y, width, height);
    }
  };

  #setSprites = () => {
    const cookieJarSprite = document.createElement("img");
    cookieJarSprite.src = "../img/cookieJar.png";

    const playerSprite = document.createElement("img");
    playerSprite.src = "../img/player.png";

    const cookieMonsterSprite = document.createElement("img");
    cookieMonsterSprite.src = "img/cookieMonster2.png";

    const exitSprite = document.createElement("img");
    exitSprite.src = "img/diamond.png";

    const backgroundSprite = document.createElement("img");
    backgroundSprite.src = "img/background-tile.jpeg";

    const wonBackgroundSprite = document.createElement("img");
    wonBackgroundSprite.src = "img/clouds.jpeg";

    const wallSprite = document.createElement("img");
    wallSprite.src = "img/wall.png";

    this.backgroundSprites = {
      "playing": backgroundSprite,
      "won": wonBackgroundSprite,
      "wall": wallSprite,
    };

    this.actorSprites = {
      "cookieMonster": cookieMonsterSprite,
      "player": playerSprite,
      "exit": exitSprite,
      "cookieJar": cookieJarSprite,
    };
  };
}

module.exports = CanvasDisplay;

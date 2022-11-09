class BlockJumpGame {
  constructor(cookieJarId) {
    this.character = document.getElementById("character");
    this.block = document.getElementById("block");
    this.jumpButton = document.getElementById("jump-button");
    this.startButton = document.getElementById("start-button");
    this.startButton.addEventListener("click", this.start);
    this.jumpButton.addEventListener("click", this.jump);
    this.jumpCounter = 0;
    this.callback;
    this.cookieJarId = cookieJarId;
  }

  run = (callback, cookieJar) => {
    console.log(
      "THE ID OF THE COOKIE JAR THAT CREATED THIS MINI-GAME:",
      cookieJar.getObjectId(cookieJar)
    );
    console.log("COOKIE JAR ID AT RUN():", this.cookieJarId);
    this.cookieJar = cookieJar;
    this.checkIfDead();
    this.displayMessage("Jump over the meteorites!");
    this.callback = callback;
    document.getElementById("block_jump_game_container").style.display =
      "inline";
  };

  start = () => {
    this.block.style.animation = "block 1s infinite linear";
  };

  displayMessage = (message) => {
    document.getElementById("text").textContent = message;
  };

  clear = () => {
    document.getElementById("block_jump_game_container").style.display = "none";
  };

  checkIfDead = () => {
    setInterval(() => {
      var characterTop = parseInt(
        window.getComputedStyle(this.character).getPropertyValue("top")
      );
      var blockLeft = parseInt(
        window.getComputedStyle(this.block).getPropertyValue("left")
      );
      if (blockLeft < 20 && blockLeft > 0 && characterTop >= 290) {
        block.style.animation = "none";
        this.clear();
        this.displayMessage("You lost!");
        console.log(
          "COOKIE JAR ID MINI-GAME CALLBACK IS REPORTING BACK TO:",
          this.cookieJar.getObjectId(this.cookieJar)
        );
        console.log("COOKIE JAR ID AT CHECKIFDEAD():", this.cookieJarId);
        this.callback("Lost");
      }
    }, 10);
  };

  jump = () => {
    if (this.character.classList != "animate") {
      this.character.classList.add("animate");
      this.jumpCounter += 1;
      if (this.jumpCounter > 4) {
        setTimeout(() => {
          block.style.animation = "none";
          this.clear();
          this.displayMessage("You won!");
          this.jumpCounter = 0;
          console.log(
            "COOKIE JAR ID MINI-GAME CALLBACK IS REPORTING BACK TO:",
            this.cookieJar.getObjectId(this.cookieJar)
          );
          console.log("COOKIE JAR ID AT JUMP():", this.cookieJarId);
          this.callback("Won");
        }, 500);
      }
    }
    setTimeout(function () {
      this.character.classList.remove("animate");
    }, 500);
  };
}

module.exports = BlockJumpGame;

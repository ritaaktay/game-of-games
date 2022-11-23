class JumpGame {
  constructor(cookieJarId) {
    this.character = document.getElementById("character");
    this.block = document.getElementById("block");
    this.jumpCounter = 0;
    this.callback;
    this.started = false;
  }

  run = (callback) => {
    window.addEventListener("keydown", this.keysEventListener);
    this.checkIfDead();
    this.displayMessage(
      "Jump over the meteorites! Press [Enter] to start and [Space Bar] to jump"
    );
    this.callback = callback;
    document.getElementById("block_jump_game_container").style.display =
      "inline";
  };

  end = () => {
    document.getElementById("block_jump_game_container").style.display = "none";
    this.jumpCounter = 0;
    clearInterval(this.setInterval);
    window.removeEventListener("keydown", this.keysEventListener);
    this.block.style.animation = "none";
  };

  keysEventListener = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.start();
    }
    if (event.key === " ") {
      this.jump();
    }
  };

  start = () => {
    this.started = true;
    this.block.style.animation = "block 1s infinite linear";
  };

  displayMessage = (message) => {
    document.getElementById("text").textContent = message;
  };

  checkIfDead = () => {
    this.setInterval = setInterval(() => {
      var characterTop = parseInt(
        window.getComputedStyle(this.character).getPropertyValue("top")
      );
      var blockLeft = parseInt(
        window.getComputedStyle(this.block).getPropertyValue("left")
      );
      if (blockLeft < 20 && blockLeft > 0 && characterTop >= 290) {
        this.#lose();
      }
    }, 10);
  };

  jump = () => {
    if (this.character.classList != "animate") {
      this.character.classList.add("animate");
      if (this.started) this.#increment();
      if (this.jumpCounter > 4) this.#win();
    }
    setTimeout(function () {
      this.character.classList.remove("animate");
    }, 500);
  };

  #increment = () => {
    this.jumpCounter += 1;
    this.displayMessage(`Almost there... ${this.jumpCounter}`);
  };

  #win = () => {
    setTimeout(() => {
      this.end();
      this.displayMessage("You won! 🍪");
      this.callback("won");
    }, 500);
  };

  #lose = () => {
    this.end();
    this.displayMessage("You lost!");
    this.callback("lost");
  };
}

module.exports = JumpGame;

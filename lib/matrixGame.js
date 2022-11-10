class MatrixGame {
  constructor() {
    this.callback;
    this.image = document.getElementById("matrix");
    this.pills = document.getElementById("pills");
  }

  run = (callback) => {
    this.callback = callback;
    this.displayMessage(
      "Make your choice. Press [R] for the red pill, [B] for the blue pill."
    );
    this.image.style.display = "inline";
    this.pills.style.display = "inline";
    window.addEventListener("keydown", this.keyHandlerFunction);
  };

  end = () => {
    window.removeEventListener("keydown", this.keyHandlerFunction);
    this.image.style.display = "none";
    this.pills.style.display = "none";
  };

  keyHandlerFunction = (event) => {
    if (event.key == "r") {
      this.end();
      this.displayMessage("You won! 🍪");
      this.callback("Won");
    }
    if (event.key == "b") {
      this.end();
      this.displayMessage("You lost!");
      this.callback("Lost");
    }
  };

  displayMessage = (message) => {
    document.getElementById("text").textContent = message;
  };
}

module.exports = MatrixGame;

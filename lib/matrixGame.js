class MatrixGame {
  constructor() {
    this.callback;
    this.image = document.getElementById("matrix");
  }

  run = (callback) => {
    this.callback = callback;
    this.displayMessage(
      "Make your choice. Press [R] for the red pill, [B] for the blue pill."
    );
    this.image.style.display = "inline";
    window.addEventListener("keydown", this.keyHandlerFunction);
  };

  end = () => {
    window.removeEventListener("keydown", this.keyHandlerFunction);
    this.image.style.display = "none";
  };

  keyHandlerFunction = (event) => {
    if (event.key == "r") {
      console.log("RED");
    }
    if (event.key == "b") {
      console.log("BLUE");
    }
  };

  displayMessage = (message) => {
    document.getElementById("text").textContent = message;
  };
}

module.exports = MatrixGame;

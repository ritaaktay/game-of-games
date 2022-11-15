class MatrixGame {
  constructor() {
    this.callback;
  }

  run = (callback) => {
    this.callback = callback;
    this.displayMessage(
      "Make your choice. Press [R] for the red pill, [B] for the blue pill."
    );
    this.imageOne = this.addImage("img/matrix.png", "matrix");
    this.imageTwo = this.addImage("img/pills.png", "pills");
    window.addEventListener("keydown", this.keyHandlerFunction);
  };

  end = () => {
    this.imageOne.remove();
    this.imageTwo.remove();
    window.removeEventListener("keydown", this.keyHandlerFunction);
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

  addImage = (url, id) => {
    const image = document.createElement("img");
    image.src = url;
    image.id = id;
    document.body.appendChild(image);
    return image;
  };
}

module.exports = MatrixGame;

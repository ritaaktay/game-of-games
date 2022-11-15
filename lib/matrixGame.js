class MatrixGame {
  constructor() {
    this.callback;
    this.matrixImg = this.addImage("img/matrix.png", "matrix");
    this.pillsImg = this.addImage("img/pills.png", "pills");
  }

  run = (callback) => {
    this.callback = callback;
    this.displayMessage(
      "Make your choice. Press [R] for the red pill, [B] for the blue pill."
    );
    console.log(this.matrixImg);
    this.matrixImg.style.display = "inline";
    this.pillsImg.style.display = "inline";
    window.addEventListener("keydown", this.keyHandlerFunction);
  };

  end = () => {
    window.removeEventListener("keydown", this.keyHandlerFunction);
    this.matrixImg.style.display = "none";
    this.pillsImg.style.display = "none";
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

class DOMDisplay {
  constructor(parent, level) {
    this.scale = 40;
    this.dom = this.#createElements(
      "div",
      { class: "game" },
      this.#drawGrid(level)
    );
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() {
    this.dom.remove();
  }

  syncState(state) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = this.#drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
  }

  #drawGrid(level) {
    return this.#createElements(
      "table",
      {
        class: "background",
        style: `width: ${level.width * this.scale}px`,
      },
      ...level.rows.map((row) =>
        this.#createElements(
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
          class: `actor ${actor.type}`,
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
}

module.exports = DOMDisplay;

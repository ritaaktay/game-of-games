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
    this.#scrollPlayerIntoView(state);
  }

  #drawGrid(level) {
    console.log(this.scale);
    console.log(`${level.width * this.scale}px`);
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

  #scrollPlayerIntoView(state) {
    {
      let width = this.dom.clientWidth;
      let height = this.dom.clientHeight;
      let margin = width / 3;

      let left = this.dom.scrollLeft,
        right = left + width;
      let top = this.dom.scrollTop,
        bottom = top + height;

      let player = state.player;
      let center = player.pos.plus(player.size.times(0.5)).times(this.scale);

      if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin;
      } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width;
      }
      if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
      } else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height;
      }
    }
  }

  trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
      if (keys.includes(event.key)) {
        down[event.key] = event.type == "keydown";
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    return down;
  }
}

module.exports = DOMDisplay;

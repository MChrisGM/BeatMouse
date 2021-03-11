class clickText {
  constructor(pos, size, txt, onClick) {
    this.pos = pos;
    this.size = size;
    this.txt = txt;
    this.onClick = onClick;

    this.cnvCoords = screenPosition(this.pos);
    this.cnvCoords.x = this.cnvCoords.x + width / 2;
    this.cnvCoords.y = this.cnvCoords.y + height / 2;

    this.boundaries = createVector(this.size * 1.5, this.size / 1.5);

    let inside = false;

    if (mouseX > this.cnvCoords.x - this.boundaries.x / 3 && mouseX < this.cnvCoords.x + this.boundaries.x / 3) {
      if (mouseY > this.cnvCoords.y - this.boundaries.y / 3 && mouseY < this.cnvCoords.y + this.boundaries.y / 3) {
        if (this.onClick) {
          if (mouseIsPressed) {
            this.onClick();
          }
        }
        inside = true;
      }
    }


    push();
    translate(this.pos.x, this.pos.y + this.size / 3, this.pos.z + 2);
    if (inside) {
      fill(233, 237, 107);
    } else {
      fill(255, 255, 255);
    }

    textFont(beatFont);
    textSize(this.size);
    textAlign(CENTER)
    text(this.txt, 0, 0);
    pop();









  }
}
class textField {
  constructor(pos, rotation, size, txt, searchText, onClick, onReturn, border, txtC, focused) {
    this.pos = pos;
    this.size = size;
    this.txt = txt;
    this.searchText = searchText;
    this.onClick = onClick;
    this.onReturn = onReturn;
    this.rot = rotation;
    this.border = border;
    this.inside = false;
    this.focused = focused;
    this.highlight = false;
    this.txtC = txtC || color(0, 0, 0);

    if (this.pos != null) {
      this.calcB();
    }
  }

  calcB() {
    this.cnvCoords = screenPosition(this.pos);
    this.cnvCoords.x = this.cnvCoords.x + width / 2;
    this.cnvCoords.y = this.cnvCoords.y + height / 2;

    this.boundaries = createVector(this.size * 20 / 3.5, this.size / 1.3);

    if (mouseX > this.cnvCoords.x - this.boundaries.x / 3 && mouseX < this.cnvCoords.x + this.boundaries.x / 3) {
      if (mouseY > this.cnvCoords.y - this.boundaries.y / 3 && mouseY < this.cnvCoords.y + this.boundaries.y / 3) {
        if (this.onClick) {
          if (mouseIsPressed && this.onClick != false) {
            this.focused = true;
          }
        }
        this.inside = true;
      } else {
        this.inside = false;
      }
    } else {
      this.inside = false;
    }

    if (this.focused) {
      this.onClick();
      this.txt = this.searchText + "|"
    }

    if (mouseIsPressed && !this.inside) {
      this.focused = false;
      this.onReturn();
    }

    if(this.searchText != ""){
      this.txt = this.searchText+"|";
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y + this.size / 3, this.pos.z + 2);

    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);

    if (this.border) {
      rectMode(CENTER);
      fill(255, 255, 255);
      stroke(255);
      strokeWeight(4);
      rect(0, -this.size / 3, this.boundaries.x + 40, this.boundaries.y + 30, 5000);
    }

    if (this.inside && this.onClick) {
      fill(233, 237, 107);
    } else {
      fill(this.txtC);
    }

    stroke(this.txtC);
    strokeWeight(100);

    if (this.highlight) {
      stroke(0);
      strokeWeight(100);
      fill(157, 237, 107);
    }

    translate(0,0,1);
    textFont(beatFont);
    textSize(this.size);
    textAlign(LEFT)
    text(this.txt, -210, 0);
    pop();
  }
}
class clickText {
  constructor(pos, rotation, size, txt, onClick, border,txtC) {
    this.pos = pos;
    this.size = size;
    this.txt = txt;
    this.onClick = onClick;
    this.rot = rotation;
    this.border = border;
    this.inside = false;
    this.highlight = false;
    this.txtC = txtC || color(255,255,255);

    if(this.pos != null){
      this.calcB();
    }
  }

  calcB() {
    this.cnvCoords = screenPosition(this.pos);
    this.cnvCoords.x = this.cnvCoords.x + width / 2;
    this.cnvCoords.y = this.cnvCoords.y + height / 2;

    this.boundaries = createVector(this.size * this.txt.length/3.5, this.size/1.3);

    if (mouseX > this.cnvCoords.x - this.boundaries.x / 3 && mouseX < this.cnvCoords.x + this.boundaries.x / 3) {
      if (mouseY > this.cnvCoords.y - this.boundaries.y / 3 && mouseY < this.cnvCoords.y + this.boundaries.y / 3) {
        if (this.onClick) {
          if (mouseIsPressed && this.onClick != false) {
            this.onClick();
          }
        }
        this.inside = true;
      }else{
        this.inside = false;
      }
    }else{
      this.inside = false;
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
      noFill();
      stroke(255);
      strokeWeight(5);
      rect(0, -this.size / 3, this.boundaries.x+40, this.boundaries.y+30, 5000);
    }

    if (this.inside && this.onClick) {
      fill(233, 237, 107);
    } else {
      fill(this.txtC);
    }

    stroke(this.txtC);
    strokeWeight(100);

    if(this.highlight){
      stroke(0);
      strokeWeight(100);
      fill(157, 237, 107);
    }

    textFont(beatFont);
    textSize(this.size);
    textAlign(CENTER)
    text(this.txt, 0, 0);
    pop();
  }
}
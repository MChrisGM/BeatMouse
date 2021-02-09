class Block {

  constructor(time, lineIndex, lineLayer, type, cutDirection) {
    this.type = type;
    if (this.type == 1) {
      this.color = color(0, 0, 255);
    } else if (this.type == 0) {
      this.color = color(255, 0, 0);
    } else if (this.type == 3) {
      this.color = color(20, 20, 20);
    }
    this.size = 35;

    this.time = time;

    this.lineIndex = lineIndex;
    this.lineLayer = lineLayer;
    this.cutDirection = cutDirection;

    this.pos = createVector(indexs[this.lineIndex], layers[this.lineLayer], -(this.time / beatLength) * 100 * this.size * 100);

    this.hit = false;

  }
  display() { //Display block
    if (this.hit) { return; }

    normalMaterial();
    stroke(60);
    smooth();
    fill(this.color);
    push();

    translate(this.pos.x, this.pos.y, this.pos.z);
    // console.log(this.pos);

    let rotation = 0;
    switch (this.cutDirection) {
      case 0:
        rotation = 0;
        break;
      case 1:
        rotation = PI;
        break;
      case 2:
        rotation = PI + PI / 2;
        break;
      case 3:
        rotation = PI / 2;
        break;
      case 4:
        rotation = 2 * PI - PI / 4
        break;
      case 5:
        rotation = PI / 4;
        break;
      case 6:
        rotation = PI + PI / 4;
        break;
      case 7:
        rotation = PI - PI / 4;
        break;
      default:
        rotation = 0;
        break;
    }
    rotate(rotation)
    box(this.size);
    translate(0, 0, (this.size / 2) + 1);
    fill(255);
    stroke(51);
    if (this.cutDirection != 8) {
      triangle(-15, 15, 15, 15, 0, 0);
    } else {
      ellipse(0, 0, 15, 15);
    }
    pop();

  }

  collision() {
    if (!this.hit) {
      let v = projectWorldToCanvas(canvas, this.pos);
      v.y = height - v.y;
      let edge = projectWorldToCanvas(canvas, createVector(370 / 4, 150 / 2, this.pos.z));

      let scale = edge.x / width;

      // console.log(pmouseY - mouseY);
      // console.log(mouseY , v.y - this.size*scale);

      if (Math.abs(cam.centerZ - this.pos.z + 350) < 300) {
        if (this.cutDirection == 1) {
          if (mouseX > v.x - this.size * scale && mouseX < v.x + this.size * scale) {
            if (pmouseY - mouseY < -20 && mouseY < v.y - this.size * scale) {
              this.hit = true;
            }
          }
        }else if(this.cutDirection == 0){
          if (mouseX > v.x - this.size * scale && mouseX < v.x + this.size * scale) {
            if (pmouseY - mouseY > 20 && mouseY > v.y + this.size * scale) {
              this.hit = true;
            }
          }
        }
        else if(this.cutDirection == 2){
          if (mouseY > v.y - this.size * scale && mouseY < v.y + this.size * scale) {
            if (pmouseX - mouseX > 20 && mouseX > v.x + this.size * scale) {
              this.hit = true;
            }
          }
        }
        else if (this.cutDirection == 3) {
          if (mouseY > v.y - this.size * scale && mouseY < v.y + this.size * scale) {
            if (pmouseX - mouseX < -20 && mouseX < v.x - this.size * scale) {
              this.hit = true;
            }
          }
        }

      }
    }

  }


}
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

      sliceFile.setVolume(0.4);

      let scale = edge.x / width;

      let h = createVector(10*(mouseX - pmouseX), 10*(mouseY - pmouseY));

      let thresholdSlice = 15;
      let hitboxOffset = 20;

      if (cam.centerZ - this.pos.z + songOffset * 2 < 300 && cam.centerZ - this.pos.z + songOffset * 2 > -1000) {
        if (this.cutDirection == 0) {
          if (h.heading() > -PI/2-PI/4 && h.heading() < -PI / 4) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 1) {
          if (h.heading() > PI/4 && h.heading() < PI/2+PI/4) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 2) {
          if (h.heading() > PI/2+PI/4 && h.heading() < PI  || h.heading() > -PI && h.heading() < -PI-PI/4  ) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 3) {
          if (h.heading() > -PI/4 && h.heading() < PI/4  ) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 4) {
          if (h.heading() > -PI && h.heading() < -PI / 2) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 5) {
          if (h.heading() > -PI/2 && h.heading() <  0) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 6) {
          if (h.heading() > PI/2 && h.heading() < PI) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 7) {
          if (h.heading() > 0 && h.heading() < PI/2) {
            if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
              if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
                this.hit = true;
                sliceFile.play();
              }
            }
          }
        }
        else if (this.cutDirection == 8) {
          if (mouseX > v.x - this.size * scale - hitboxOffset && mouseX < v.x + this.size * scale + hitboxOffset) {
            if (mouseY > v.y - this.size * scale - hitboxOffset && mouseY < v.y + this.size * scale + hitboxOffset) {
              this.hit = true;
              sliceFile.play();
            }
          }
        }

      }
    }

  }


}
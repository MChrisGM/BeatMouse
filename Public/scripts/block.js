class Block {

  constructor(time, lineIndex, lineLayer, type, cutDirection) {
    this.type = type;

    this.size = 35;

    this.time = time;

    this.lineIndex = lineIndex;
    this.lineLayer = lineLayer;
    this.cutDirection = cutDirection;

    let c = levelScheme;

    if (this.type == 1) {
      this.color = color(c['R'][0], c['R'][1], c['R'][2]);
    } else if (this.type == 0) {
      this.color = color(c['L'][0], c['L'][1], c['L'][2]);
    } else if (this.type == 3) {
      this.color = color(20, 20, 20);
      this.cutDirection = 8;
    }
    this.rotation = 0;

    if(this.cutDirection == 8 ){
      this.model = blockModelCen;
    }else{
      this.model = blockModelDir;
    }

    this.pos = createVector(
      indexs[this.lineIndex], 
      layers[this.lineLayer], 
      (-(this.time / beatLength) * 100 * this.size * 100)+300
    );
    
    this.vel = createVector(0,0,0);

    this.hit = false;
    this.missed = false;
    this.score = 0;

    this.sliceSound = new Sound(sliceFile);

    switch (this.cutDirection) {
      case 0:
        this.rotation = 0;
        break;
      case 1:
        this.rotation = PI;
        break;
      case 2:
        this.rotation = PI + PI / 2;
        break;
      case 3:
        this.rotation = PI / 2;
        break;
      case 4:
        this.rotation = 2 * PI - PI / 4
        break;
      case 5:
        this.rotation = PI / 4;
        break;
      case 6:
        this.rotation = PI + PI / 4;
        break;
      case 7:
        this.rotation = PI - PI / 4;
        break;
      default:
        this.rotation = 0;
        break;
    }

  }

  move(){
    this.vel.z = objectVelocity;
    this.pos.add(this.vel);
  }

  display() { //Display block
    if (this.hit) { return; }

    let cameraZdistance = cam.centerZ - this.pos.z;

    smooth();

    stroke(60);

    let r = map(cameraZdistance, 500, 2500, this.color.levels[0], 0);
    let g = map(cameraZdistance, 500, 2500, this.color.levels[1], 0);
    let b = map(cameraZdistance, 500, 2500, this.color.levels[2], 0);

    emissiveMaterial(r, g, b);
    strokeWeight(1);
    shininess(5);

    if (this.type == 3) {
      specularMaterial(this.color);
      shininess(10);
      stroke(180);
    }

    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    smooth();
    noStroke();

    if (this.type == 1 || this.type == 0) {
      rotateZ(this.rotation);
      push();
      scale(23);
      model(this.model);
      pop();
      translate(0, 0, (this.size / 2) - 10);
      if (cam.centerZ - this.pos.z < -100 && hitIndicator) {
        fill(255, 119, 41);
      } else {
        fill(255);
      }
      rectMode(CENTER);
      rect(0,0,25,25);
    } else if (this.type == 3) {
      push();
      scale(23);
      fill(90);
      model(mineModel);
      pop();
    }
    pop();
  }

  collision() {
    if (!sp || paused) { return; }
    if (!this.hit && !this.missed) {
      if (cam.centerZ - this.pos.z < -200  && cam.centerZ - this.pos.z > -1000 ) {

        if ((options.slice_Volume.value / 100) <= 0) {
          this.sliceSound.setVolume(0);
        } else {
          this.sliceSound.setVolume((options.slice_Volume.value / 100));
        }

        let v = screenPosition(this.pos);
        v.x = v.x + width / 2;
        v.y = v.y + height / 2;

        let edge = screenPosition(createVector(this.pos.x + this.size / 2,

          this.pos.y + this.size / 2, this.pos.z));
        edge.x = edge.x + width / 2;
        edge.y = edge.y + height / 2;

        let h = createVector(100 * (mouseX - pmouseX), 100 * (mouseY - pmouseY));

        let hitboxOffsetB;
        if (this.type == 3) {
          hitboxOffsetB = 0;
        } else {
          hitboxOffsetB = 1.8 * hitboxOffset;
        }

        let projectionSizeX = edge.x - v.x;
        let projectionSizeY = edge.y - v.y;

        let rightX = v.x + projectionSizeX + hitboxOffsetB;
        let leftX = v.x - projectionSizeX - hitboxOffsetB;
        let centerX = (leftX + rightX) / 2;

        let upY = v.y + projectionSizeY + hitboxOffsetB;
        let downY = v.y - projectionSizeY - hitboxOffsetB;
        let centerY = (downY + upY) / 2;

        function slicePoint(cut) {
          let point = 0;
          switch (cut) {
            case 0:
              if (mouseX > centerX) {
                point = map(mouseX, centerX, rightX, 30, 0);
              } else {
                point = map(mouseX, centerX, leftX, 30, 0);
              }
              break;
            case 1:
              if (mouseX > centerX) {
                point = map(mouseX, centerX, rightX, 30, 0);
              } else {
                point = map(mouseX, centerX, leftX, 30, 0);
              }
              break;
            case 2:
              if (mouseY > centerY) {
                point = map(mouseY, centerY, upY, 30, 0);
              } else {
                point = map(mouseY, centerY, downY, 30, 0);
              }
              break;
            case 3:
              if (mouseY > centerY) {
                point = map(mouseY, centerY, upY, 30, 0);
              } else {
                point = map(mouseY, centerY, downY, 30, 0);
              }
              break;
            case 4:
              if (mouseX < rightX && mouseY > (centerY + downY) / 2) {
                point = map(mouseX, rightX, centerX, 30, 0);
              } else {
                point = map(mouseY, downY, centerY, 30, 0);
              }
              break;
            case 5:
              if (mouseX > leftX / 2 && mouseY > (centerY + downY) / 2) {
                point = map(mouseX, leftX, centerX, 30, 0);
              } else {
                point = map(mouseY, downY, centerY, 30, 0);
              }
              break;
            case 6:
              if (mouseX < rightX / 2 && mouseY < (centerY + upY) / 2) {
                point = map(mouseX, rightX, centerX, 30, 0);
              } else {
                point = map(mouseY, upY, centerY, 30, 0);
              }
              break;
            case 7:
              if (mouseX > leftX && mouseY < (centerY + upY) / 2) {
                point = map(mouseX, leftX, centerX, 30, 0);
              } else {
                point = map(mouseY, upY, centerY, 30, 0);
              }
              break;
          }

          point = Math.abs(point);
          if (point > 30) { point = 30; }
          return point;
        }

        let minSOffset = 0;
        let maxSOffset = 8000;

        if (mouseX > leftX && mouseX < rightX) {
          if (mouseY > downY && mouseY < upY) {
            if (this.cutDirection == 0) {
              if (h.heading() > -PI / 2 - PI / 4 && h.heading() < -PI / 4) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 1) {
              if (h.heading() > PI / 4 && h.heading() < PI / 2 + PI / 4) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 2) {
              if (h.heading() > PI / 2 + PI / 4 && h.heading() < PI || h.heading() > -PI && h.heading() < -PI - PI / 4) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 3) {
              if (h.heading() > -PI / 4 && h.heading() < PI / 4) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 4) {
              if (h.heading() > -PI && h.heading() < -PI / 2) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 5) {
              if (h.heading() > -PI / 2 && h.heading() < 0) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 6) {
              if (h.heading() > PI / 2 && h.heading() < PI) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 7) {
              if (h.heading() > 0 && h.heading() < PI / 2) {
                this.hit = true;
                let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
                if (s > 100) { s = 100; }
                this.score = s + slicePoint(this.cutDirection);
                this.sliceSound.play();
              }
            }
            else if (this.cutDirection == 8) {
              this.hit = true;
              let s = map(h.mag(), minSOffset, maxSOffset, 0, 100);
              if (s > 100) { s = 100; }
              this.score = s + slicePoint(this.cutDirection);
              this.sliceSound.play();
            }
          }
        }

        if (this.type != 3 && this.hit) {
          if (this.score > 130) {
            this.score = 130;
          }
          this.score = Math.floor(this.score);

          let scoreEl = document.createElement('div');
          scoreEl.style.position = "absolute";
          scoreEl.style.left = centerX + "px";
          scoreEl.style.bottom = "30%";
          scoreEl.style.textAlign = "left";
          scoreEl.style.color = this.color.toString();
          scoreEl.style.fontSize = "2vw";
          scoreEl.innerHTML = this.score;
          this.color.setRed(this.color.levels[0] + 30);
          this.color.setGreen(this.color.levels[1] + 30);
          this.color.setBlue(this.color.levels[2] + 30);
          scoreEl.style.webkitTextStroke = "1px " + this.color.toString();
          document.body.appendChild(scoreEl);

          jQuery(scoreEl).fadeOut("slow", function() {
            jQuery(this).remove();
          });
        }

      }

      if (this.type != 3 && cam.centerZ - this.pos.z < -1000) {
          this.missed = true;
          this.sliceSound.destruct();
          this.score = 0;

          let scoreEl = document.createElement('div');
          scoreEl.style.position = "absolute";
          scoreEl.style.left = window.innerWidth/2 + "px";
          scoreEl.style.bottom = "30%";
          scoreEl.style.textAlign = "center";
          scoreEl.style.color = "pink";
          scoreEl.style.fontSize = "2vw";
          scoreEl.innerHTML = "Miss";
          scoreEl.style.webkitTextStroke = "1px red";
          document.body.appendChild(scoreEl);

          jQuery(scoreEl).fadeOut("slow", function() {
            jQuery(this).remove();
          });

        }



      if (this.hit && this.type == 3) {
        this.missed = true;
        this.sliceSound.destruct();
        this.score = 0;
      }

    }

  }


}
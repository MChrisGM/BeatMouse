class Obstacle {
  constructor(time, lineIndex, type, duration, width) {
    this.time = time;
    this.lineIndex = lineIndex;
    this.type = type;
    this.duration = duration;
    this.width = width;
    this.size = 50;

    this.vel = createVector(0,0,0);

    let c = levelScheme;
    this.color = color(c['W'][0], c['W'][1], c['W'][2]);

    this.crh = 10;
    this.h = 100;
    if (this.type == 1) {
      this.crh = -20;
      this.h = 50;
    } else {
      this.crh = 6;
      this.h = 160;
    }

    this.pos = createVector(
      0,
      this.crh,
      -(this.time / beatLength) * 100 * 35 * 100
    );


    switch(this.width){
      case 1:
      this.pos.x = indexs[this.lineIndex];
      break;
      case 2:
      this.pos.x = (indexs[this.lineIndex]+indexs[this.lineIndex+1])/2;
      this.width == 2.5;
      break;
      case 3:
      this.pos.x = indexs[this.lineIndex+1];
      this.width = 3.5;
      break;
      case 4:
      this.pos.x = (indexs[1]+indexs[2])/2;
      this.width = 4.5;
      break;
      default:
      this.pos.x = indexs[this.lineIndex];
      this.width = 1;
      break;

    }
    
    this.pos.z+=300;

  }

  move(){
    this.vel.z = objectVelocity;
    this.pos.add(this.vel);
  }

  display() { //Display obstacle

    // normalMaterial();
    // stroke(255);
    // smooth();
    // fill(255,0,0,100);

    smooth();
    lights();

    shininess(20);
    stroke(255);
    this.color.setAlpha(200);
    emissiveMaterial(this.color);

    push();

    translate(this.pos.x, this.pos.y, this.pos.z+(-(this.duration / beatLength) * 100 * 35 * 100 )/4);

    box(this.size*this.width, this.h, (-(this.duration / beatLength) * 100 * 35 * 100 )/2);

    pop();

  }
}
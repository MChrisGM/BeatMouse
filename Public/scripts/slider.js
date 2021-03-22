class Slider{
  constructor(p,r,length,width,color,defaultValue,onClick){
    this.pos = p;
    this.rot = r;
    this.length = length;
    this.width = width;
    this.color = color;
    this.value = defaultValue/100;
    this.onClick = onClick;
    this.inside = false;

    this.slideValue = this.value*100;

    this.cnvCoords;
    this.lB;
    this.rB;

    if(this.pos != null){
      this.calcB();
    }
  }

  calcB() {
    this.cnvCoords = screenPosition(this.pos);
    this.cnvCoords.x = this.cnvCoords.x + width / 2;
    this.cnvCoords.y = this.cnvCoords.y + height / 2;

    this.lB = screenPosition(createVector(this.pos.x-this.length/2,this.pos.y,this.pos.z));
    this.rB = screenPosition(createVector(this.pos.x+this.length/2,this.pos.y,this.pos.z));
    this.lB.x += width/2;
    this.lB.y += height/2; 
    this.rB.x += width/2; 
    this.rB.y += height/2;

    if (mouseX > this.lB.x && mouseX < this.rB.x) {
      if (mouseY >  this.cnvCoords.y-this.width/2 && mouseY <  this.cnvCoords.y+this.width/2) {
        if (this.onClick) {
          if (mouseIsPressed && this.onClick != false) {
            this.slideValue = map(mouseX,this.lB.x,this.rB.x,0,1)*100;
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

  display(){
    push();
    translate(this.pos.x,this.pos.y,this.pos.z);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);
    
    fill(this.color);
    rectMode(CENTER);
    noFill();
    stroke(this.color)
    strokeWeight(5);
    rect(0,0,this.length,this.width);

    rectMode(CORNER);
    fill(this.color)
    rect(-this.length/2,-this.width/2,(this.length*this.value),this.width);

    pop();

    new clickText(createVector(this.pos.x + this.length - 40, this.pos.y, this.pos.z+1), this.rot, 2*this.width, Math.floor(this.slideValue).toPrecision(2), false, false).display();

  }
}
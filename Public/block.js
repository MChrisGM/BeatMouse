class Block {

    constructor(bType, x, y, z, bx, by, bz) {
        this.pos = new createVector(x[bx], y[by], z[bz]);
        if (bType == 'r') {
            this.bC = color(0, 0, 255);
        } else if (bType == 'l') {
            this.bC = color(255, 0, 0);
        }
        else {
            this.bC = color(120);
        }
        this.bLx = x;
        this.bLy = y;
        this.bLz = z;

        this.bS = 50;
        this.bx = bx;
        this.by = by;
        this.bz = bz;
    }
    display() { //Display block
        normalMaterial();
        stroke(60);
        smooth();
        fill(this.bC);
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        box(this.bS);
        translate(0, 0, (this.bS / 2) + 1);
        fill(255);
        stroke(51);
        ellipse(0, 0, 20, 20);
        pop();

    }
    place() {

    }
    changeX(s) {

        this.bx = s;

        this.pos = new createVector(this.bLx[this.bx], this.bLy[this.by], this.bLz[this.bz]);
    }
    changeY(d) {

        this.by = d;

        this.pos = new createVector(this.bLx[this.bx], this.bLy[this.by], this.bLz[this.bz]);
    }
    setC(c) {
        if (c == 'r') {
            this.bC = color(0, 0, 255);
        } else if (c == 'l') {
            this.bC = color(255, 0, 0);
        }
    }
    getxyz() { //Return "indexX,indexY,indexZ"
        return ({selectedX:this.bx, selectedY:this.by, zLayer:this.bz});
    }

}
class fPlane {
    constructor(lx, ly, lz, i) {
        this.bLx = lx;
        this.bLy = ly;
        this.bLz = lz;
        this.i = i;
        this.selected = false;
    }
    display() {
        push();
        translate(0, 0, this.bLz[this.i]);
        if (this.selected) {
            fill(224, 212, 157, 100);
        } else {
            fill(120, 20);
        }
        smooth();
        rect(-150, -100, 300, 200);
        if (this.selected) {
            fill(224, 212, 157, 100);
            stroke(224, 212, 157);
        } else {
            fill(120, 20);
            stroke(0);
        }
        rect(this.bLx[0] - 30, this.bLy[1] - 30, 60, 60);
        rect(this.bLx[1] - 30, this.bLy[0] - 30, 60, 60);
        rect(this.bLx[0] - 30, this.bLy[0] - 30, 60, 60);
        rect(this.bLx[2] - 30, this.bLy[1] - 30, 60, 60);
        rect(this.bLx[2] - 30, this.bLy[0] - 30, 60, 60);
        pop();
    }
    select(s) {
        this.selected = s;
    }
}
class Obstacle{
    constructor(time, lineIndex, type, duration, width){
        this.time = time;
        this.lineIndex = lineIndex;
        this.type = type;
        this.duration = duration;
        this.width = width;

        this.crh = 10;
        this.h = 100;
        if (this.type == 1){
            this.crh = -30;
            this.h = 50;
        }else{
            this.crh = 10;
            this.h = 100;
        }

        this.pos = createVector(indexs[this.lineIndex], this.crh, -(this.time/beatLength) * 100 * 35 * 100);
    }

    display() { //Display obstacle

        normalMaterial();
        stroke(255);
        smooth();
        fill(255,0,0,80);
        push();

        translate(this.pos.x,this.pos.y, this.pos.z);

        box(35, this.h, -(this.duration/beatLength) * 100 * 35 * 100);

        pop();

    }
}
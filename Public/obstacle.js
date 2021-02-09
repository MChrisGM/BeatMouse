class Obstacle{
    constructor(time, lineIndex, type, duration, width){
        this.time = time;
        this.lineIndex = lineIndex;
        this.type = type;
        this.duration = duration;
        this.width = width;
    }

    display() { //Display block

        normalMaterial();
        stroke(255);
        smooth();
        fill(255,0,0,120);
        push();

        
        let crh = 10;
        let h = 100;
        if (this.type == 1){
            crh = -30;
            h = 50;
        }else{
            crh = 10;
            h = 100;
        }
        translate(indexs[this.lineIndex], crh, -(this.time/beatLength) * 100 * 35 * 100);

        box(35, h, -(this.duration/beatLength) * 100 * 35 * 100);

        pop();

    }
}
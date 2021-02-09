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

    }
    display() { //Display block

        normalMaterial();
        stroke(60);
        smooth();
        fill(this.color);
        push();
        // translate(indexs[this.lineIndex], layers[this.lineLayer], -(this.time*(4*35)/(bpm/60))*speedM);

        // translate(indexs[this.lineIndex], layers[this.lineLayer], -this.time*(4*this.size)/(bpm/60));

        translate(indexs[this.lineIndex], layers[this.lineLayer], -(this.time/beatLength) * 100 * this.size * 100);


        let rotation = 0;
        switch (this.cutDirection) {
            case 0:
                rotation = 0;
                break;
            case 1:
                rotation = PI;
                break;
            case 2:
                rotation = PI + PI/2;
                break;
            case 3:
                rotation = PI / 2;
                break;
            case 4:
                rotation = 2*PI-PI/4
                break;
            case 5:
                rotation = PI/4;
                break;
            case 6:
                rotation = PI + PI/4;
                break;
            case 7:
                rotation = PI - PI/4;
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


}
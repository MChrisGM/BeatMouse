var sp = false; //Start-Pause button
var pB = false; //Placing blocks
var lS = true; //Layers showing

let currentNote;
var noteP = false;
var noteDone = false;

let cam;
let camMS = -10;

var songBPM = 400;

var bLy = [-40, 40];

var bLx = [-100, 0, 100];

var bLz = [];
for (var i = 0; i < 200; i++) {
    bLz.push(-i * 100);
}

var zLayer = 0;
var selectedC = 'r';

let fPlanes = [];
let notes = [];

function setup() {
    createCanvas(innerWidth, innerHeight, WEBGL);
    cam = createCamera();

    for (var i = 0; i < bLz.length; i++) {
        fPlanes.push(new fPlane(bLx, bLy, bLz, i));
    }

    document.addEventListener('contextmenu', event => event.preventDefault());

    //console.log(note1.getxyz());

}

function draw() {
    background(10);
    normalMaterial();
    display();
    placeNmove();

    fPlanes[zLayer].select(true);

    if (zLayer > 0) {
        fPlanes[zLayer - 1].select(false);
    }
    if (zLayer < (fPlanes.length - 1)) {
        fPlanes[zLayer + 1].select(false);
    }

    if (sp) {
        cam.move(0, 0, camMS);
    }
    if (selectedC == 'r') {
        document.getElementById('box').style.backgroundColor = 'blue';
    }
    if (selectedC == 'l') {
        document.getElementById('box').style.backgroundColor = 'red';
    }
    drawTrack();

}

let saved = [];
var readMap = function () {
    console.log(`notes is currently: ${notes}`);
    for (var i = 0; i < notes.length; i++) {
        var xyzIndex = notes[i].getxyz();
        console.log(i + "," + xyzIndex);
        saved.push(xyzIndex);
    }
    console.log(saved);
}
module.exports = {
    readMap: readMap
}

function display() {
    if (lS) {
        for (var i = 0; i < fPlanes.length; i++) {
            fPlanes[i].display();
        }
    }

    if (notes != null) {
        for (var j = 0; j < notes.length; j++) {
            notes[j].display();
        }
    }
    if (currentNote != null) {
        currentNote.display();
    }
}

var selectedX;
var selectedY;

function placeNmove() {
    if (!noteDone && currentNote != null) {
        if (!(mouseX > width / 3 && mouseX < 2 * width / 3 && mouseY > height / 2)) {
            if (mouseX < width / 3) {
                currentNote.changeX(0);
                selectedX=0;
            }
            if (mouseX > width / 3 && mouseX < (2 * width / 3)) {
                currentNote.changeX(1);
                selectedX=1;
            }
            if (mouseX > 2 * width / 3) {
                currentNote.changeX(2);
                selectedX=2;
            }

            if (mouseY < height / 2) {
                currentNote.changeY(0);
                selectedY=0;
            }
            if (mouseY > height / 2) {
                currentNote.changeY(1);
                selectedY=1;
            }
        }

    }

    if (mouseIsPressed) {
        if (mouseButton === RIGHT && noteP == false) {
             selected = false;

            for(var i=0; i<notes.length;i++){
                // console.log(notes[i].getxyz());
                // console.log({selectedX,selectedY,zLayer});
                if(notes[i].getxyz() === {selectedX,selectedY,zLayer}){
                    console.log("Selected");
                    selected = true;
                }
            }
            if(!selected){
                currentNote = new Block(null, bLx, bLy, bLz, 1, 0, zLayer);
            }
            else{
                console.log("already placed")
                //Highlight block
            }
            //console.log(((width / 2) - (mouseX)) + "," + ((height / 2) - (mouseY)));
            noteDone = false;
            noteP = true;

        }
        if (mouseButton === LEFT) {
            if (mouseY < 9 * height / 10) {
                if (!noteDone && noteP == true) {
                    currentNote.setC(selectedC);
                    notes.push(currentNote);
                    noteDone = true;
                    noteP = false;
                    zLayer += 1;
                    console.log(currentNote.getxyz());
                    console.log(notes.length);
                }
            }
        }
    }
}

function keyPressed() {
    if (keyCode == 32) { //Space
        sp = !sp;
    }
    if (keyCode == 38) { //Move forward w/ speed*10
        cam.move(0, 0, camMS * 10);
    }
    if (keyCode == 40) { //Move backwards w/ speed*10
        cam.move(0, 0, -camMS * 10);
    }
    if (keyCode == 39) { //Move forward w/ normal speed
        cam.move(0, 0, camMS);
    }
    if (keyCode == 37) { //Move backwards w/ normal speed
        cam.move(0, 0, -camMS);
    }
    if (keyCode == 76) {  //Display Layers
        lS = !lS;
    }
    if (!noteP) {  //Select layer
        if (keyCode == 87) {
            if (zLayer < (fPlanes.length - 1)) {
                zLayer += 1;
            }
        }
        if (keyCode == 83) {
            if (zLayer > 0) {
                zLayer -= 1;
            }
        }
    }
    if (keyCode == 27) { //Escape from placing note
        if (noteP) {
            currentNote = null;
            noteP = false;
        }
    }
    if (keyCode == 81) { //Select red with "q"
        redSelect();
    }
    if (keyCode == 69) { //Select blue with "e"
        blueSelect();
    }


}
function blueSelect() {
    selectedC = 'r';
}
function redSelect() {
    selectedC = 'l';
}

function drawTrack() {
    noStroke();
    fill(40);
    push();
    translate(0, 100);
    box(400, 10, 100000);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    width = windowWidth;
    height = windowHeight;
}
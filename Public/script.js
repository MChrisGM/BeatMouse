let canvas;
let cam;
let cameraPos;

let speedM = 2;

const Y_AXIS = 1;
const X_AXIS = 2;

let scaleX;
let scaleY;
let songInput;
let ppbutton;

let songFile;
let infoFile;
let levelFile;

let playing = false;
let paused = false;

let zip = new JSZip();

let beatLength;
let beats = [];
let obstacles = [];
let bpm;
let songDuration;

let indexs = [-60, -20, 20, 60];
let layers = [50, 10, -30];

let sp = false;

function preload() {

  infoFile = loadJSON("/song/Info.dat");

  songFile = loadSound('/song/song.ogg');

  levelFile = loadJSON("/song/OneSaberNormal.dat");

}


function initialize() {

  frameRate(60);

  bpm = infoFile['_beatsPerMinute'];
  songDuration = songFile.duration();
  beatLength = songDuration * (bpm / 60);
  setBPM(bpm);

  let notes = levelFile['_notes'];
  for (let note of notes) {
    let time = note['_time'];
    let type = note['_type'];
    let lineIndex = note['_lineIndex'];
    let lineLayer = note['_lineLayer'];
    let cutDirection = note['_cutDirection'];
    let block = new Block(time, lineIndex, lineLayer, type, cutDirection);
    beats.push(block);
  }

  let obs = levelFile['_obstacles'];
  for (let obstacle of obs) {
    let time = obstacle['_time'];
    let type = obstacle['_type'];
    let lineIndex = obstacle['_lineIndex'];
    let duration = obstacle['_duration'];
    let width = obstacle['_width'];
    let o = new Obstacle(time, lineIndex, type, duration, width);
    obstacles.push(o);
  }

  // beats.push(new Block(4, 1, 1, 1, 6));


  // if (window.innerWidth < window.innerHeight){
  //   canvas = createCanvas(window.innerHeight,window.innerWidth);
  //   canvas.id("drawingCanvas");
  //   document.getElementById("drawingCanvas").style.transform = "rotate(-90deg)";
  // }else{
  //   canvas = createCanvas(window.innerWidth,window.innerHeight);
  //   canvas.id("drawingCanvas");
  //   document.getElementById("drawingCanvas").style.transform = "rotate(0deg)";
  // }

  // background(51);

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  cameraPos = createVector(0, 0, 350);
  cam.setPosition(cameraPos.x, cameraPos.y, cameraPos.z);

  scaleX = width / 1920;
  scaleY = height / 1080;

  // let inputWidth = 200;
  // let inputHeight = 100;

  // songInput = createFileInput(handleFile);
  // songInput.position((width/2)-(inputWidth*scaleX/2), (height/2)-(inputHeight*scaleY/2));
  // songInput.size(inputWidth*scaleX,inputHeight*scaleY);

  // songInput.hide();

  // ppbutton = createButton('Toggle');
  // ppbutton.position(width/2, height/2);
  // ppbutton.mousePressed(togglePlay);



}

function togglePlay() {
  paused = !paused;
  console.log(paused);
}

function handleFile(file) {
  console.log(file);
  if (file.subtype == "x-zip-compressed") {
    zip.load(file);
  }
}


function windowResized() {
  initialize();
}
function setup() {
  initialize();
}


function draw() {
  background(30);

  noStroke();
  fill(50);
  push();
  translate(0, 150, 0);
  box(370, 1, 1000000);
  pop();

  for (let block of beats) {
    block.display();
    block.collision();

  }
  for (let obstacle of obstacles) {
    obstacle.display();
  }

  let camMS = (bpm / 60) * (1 / (beatLength)) / frameRate() * 100 * 35 * 100;

  cameraPos.z = -camMS;
  

  if (sp) {
    cam.move(cameraPos.x, cameraPos.y, cameraPos.z);

    if (!songFile.isPlaying()) {
      songFile.play();
    }
  } else {
    if (songFile.isPlaying()) {
      songFile.pause();
    }
  }
}

function keyPressed() {
  if (keyCode == 32) { //Space
    sp = !sp;
  }


}

function displayMenu() {
  let blue = color(0, 0, 255);
  let red = color(255, 0, 0);

  let menuWidth = 500;
  let menuHeight = 600;

  setGradient((width / 2) - (menuWidth * scaleX / 2), (height / 2) - (menuHeight * scaleY / 2), menuWidth * scaleX, menuHeight * scaleY, red, blue, X_AXIS);

  stroke(0);
  fill(255);
  strokeWeight(2);
  textAlign(CENTER);
  textSize(90 * scaleX);
  text("BeatMouse", width / 2, height / 2 - (200 * scaleY))

}


function song() {
  if (songFile.isPlaying() && paused) {
    songFile.pause();
  } else if (songFile.isPaused() && !paused) {
    songFile.play();
  }
}



function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
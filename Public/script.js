let canvas;
const Y_AXIS = 1;
const X_AXIS = 2;

let scaleX;
let scaleY;
let songInput;
let ppbutton;

let songFile;

let playing = false;
let paused = false;

let zip = new JSZip();

function preload(){
  songFile = loadSound('song/song.ogg');
}

function initialize(){
  if (window.innerWidth < window.innerHeight){
    canvas = createCanvas(window.innerHeight,window.innerWidth);
    canvas.id("drawingCanvas");
    document.getElementById("drawingCanvas").style.transform = "rotate(-90deg)";
  }else{
    canvas = createCanvas(window.innerWidth,window.innerHeight);
    canvas.id("drawingCanvas");
    document.getElementById("drawingCanvas").style.transform = "rotate(0deg)";
  }

  background(51);

  scaleX = width/1920;
  scaleY = height/1080;

  let inputWidth = 200;
  let inputHeight = 100;

  // songInput = createFileInput(handleFile);
  // songInput.position((width/2)-(inputWidth*scaleX/2), (height/2)-(inputHeight*scaleY/2));
  // songInput.size(inputWidth*scaleX,inputHeight*scaleY);

  // songInput.hide();

  ppbutton = createButton('Toggle');
  ppbutton.position(width/2, height/2);
  ppbutton.mousePressed(togglePlay);

}

function togglePlay(){
  paused = !paused;
  console.log(paused);
}

function handleFile(file) {
  console.log(file);
  if (file.subtype == "x-zip-compressed") {
    zip.load(file);
  }
}


function windowResized(){
  initialize();
}
function setup(){
  initialize();
}


function draw(){
  if(!paused){
    background(51);
    displayMenu();
  }else{
    song();
  }
    
  // songInput.show();

}

function displayMenu(){
  let blue = color(0,0,255);
  let red = color(255,0,0);

  let menuWidth = 500;
  let menuHeight = 600;

  setGradient((width/2)-(menuWidth*scaleX/2),(height/2)-(menuHeight*scaleY/2),menuWidth*scaleX,menuHeight*scaleY, red, blue, X_AXIS);

  stroke(0);
  fill(255);
  strokeWeight(2);
  textAlign(CENTER);
  textSize(90 * scaleX);
  text("BeatMouse",width/2,height/2-(200*scaleY))

}


function song(){
  if(songFile.isPlaying() && paused){
    songFile.pause();
  }else if(songFile.isPaused() && !paused){
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
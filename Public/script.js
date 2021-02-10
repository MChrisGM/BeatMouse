let canvas;
let cam;
let cameraPos;

let speedM = 2;

let hitboxOffset = 30;

const Y_AXIS = 1;
const X_AXIS = 2;

let scaleX;
let scaleY;

let songInput;
let ppbutton;
let scoreDiv;
let leftContainer;
let progressBar;
let timeProgress;
let rightContainer;

let songFile;
let infoFile;
let levelFile;
let sliceFile;

let playing = false;
let paused = false;

let beatLength;
let beats = [];
let obstacles = [];
let bpm;
let songDuration;

let indexs = [-60, -20, 20, 60];
let layers = [50, 10, -30];

let sp = false;

let songOffset = 300;


let combo = 0;
let combos = [0];
let missedNotes = 0;
let mCombo;
let mNotes;
let songNames = ['Beat_saber','Lone_Digger','PopStars'];
let songIndex = 2;
let modes = ['easy','normal','hard','expert','expert+'];
let modeIndex = 0;

p5.disableFriendlyErrors = true;

function preload() {

  infoFile = loadJSON("/songs/"+songNames[songIndex]+"/Info.dat");
  songFile = loadSound('/songs/'+songNames[songIndex]+'/song.ogg');

  if (modes[modeIndex] == 'easy') {
    levelFile = loadJSON("/songs/"+songNames[songIndex]+"/OneSaberEasy.dat");
  }else if (modes[modeIndex] == 'normal') {
    levelFile = loadJSON("/songs/"+songNames[songIndex]+"/OneSaberNormal.dat");
  } else if (modes[modeIndex] == 'hard') {
    levelFile = loadJSON("/songs/"+songNames[songIndex]+"/OneSaberHard.dat");
  } else if (modes[modeIndex] == 'expert'){
    levelFile = loadJSON("/songs/"+songNames[songIndex]+"/OneSaberExpert.dat");
  }else if (modes[modeIndex] == 'expert+'){
    levelFile = loadJSON("/songs/"+songNames[songIndex]+"/OneSaberExpertPlus.dat");
  }
  sliceFile = loadSound("/sounds/HitShortRight2.ogg");

}


function initialize() {

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  cameraPos = createVector(0, 0, songOffset);
  cam.setPosition(cameraPos.x, cameraPos.y, cameraPos.z);

  scaleX = width / 1920;
  scaleY = height / 1080;

  document.addEventListener('contextmenu', event => event.preventDefault());

}

function windowResized() {
  initialize();
  leftContainer.position(width / 5, height / 2.5);
  rightContainer.position(4 * width / 5, height / 2.5);
}
function setup() {

  frameRate(60);

  bpm = infoFile['_beatsPerMinute'];
  songDuration = songFile.duration();
  beatLength = songDuration * (bpm / 60);
  setBPM(bpm);

  songFile.setVolume(0.8);

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

  initialize();

    leftContainer = createDiv();
  leftContainer.id("leftContainer");
  leftContainer.position(width / 5, height / 2.5);

  rightContainer = createDiv();
  rightContainer.id("rightContainer");
  rightContainer.position(4 * width / 5, height / 2.5);

  scoreDiv = createDiv('Combo<br>0');
  scoreDiv.class('score');
  scoreDiv.id('scoreDiv');
  scoreDiv.parent(leftContainer);

  progressBar = document.createElement("div");
  progressBar.classList = 'bar';

  timeProgress = document.createElement('p');
  timeProgress.id = 'timeProgress';

  document.getElementById('leftContainer').appendChild(timeProgress);
  document.getElementById('leftContainer').appendChild(progressBar);

  mNotes = document.createElement('p');
  mCombo = document.createElement('p');
  mNotes.classList = 'stats';
  mCombo.classList = 'stats';
  document.getElementById('rightContainer').appendChild(mNotes);
  document.getElementById('rightContainer').appendChild(mCombo);

}

function draw() {
  background(15);

  noStroke();
  fill(65);
  push();
  translate(0, 150, 0);
  box(370, 1, 1000000);
  pop();

  if (keyIsDown(16)){ //Shift
    cam.setPosition(cam.eyeX, 40, cam.eyeZ);
  }else{
    cam.setPosition(cam.eyeX, 0, cam.eyeZ);
  }
  if (keyIsDown(65)){ //A
    cam.setPosition(-40, cam.eyeY, cam.eyeZ);
  }else if (keyIsDown(68)){ //D
    cam.setPosition(40, cam.eyeY, cam.eyeZ);
  }else{
    cam.setPosition(0, cam.eyeY, cam.eyeZ);
  }
  

  for (let block of beats) {
    if (!block.hit && !block.missed && cam.centerZ - block.pos.z < 5000 && cam.centerZ - block.pos.z > -2000) {
      block.display();
      block.collision();
      if (block.missed) {
        combos.push(parseInt(combo));
        combo = 0;
        missedNotes += 1;
        continue;
      }
      if (block.hit) {
        combo += 1;
        continue;
      }
    }
  }

  var currentT = songFile.currentTime()
  timeProgress.innerText = format(currentT) + '/' + format(songDuration);

  let max = combos.reduce(function(a, b) {
    return Math.max(a, b);
  });

  if(combo > max){max = combo};

  mNotes.innerText = 'Missed notes: ' + missedNotes;
  mCombo.innerText = 'Max combo: ' + max;

  scoreDiv.html('Combo<br>' + combo);
  progressBar.style.width = (currentT / songDuration) * 100 + '%';

  for (let obstacle of obstacles) {
    if (cam.centerZ - obstacle.pos.z < 5000 && cam.centerZ - obstacle.pos.z > -10000) {
      obstacle.display();
    }
  }

  if (sp) {
    let camMS = (bpm / 60) * (1 / (beatLength)) / frameRate() * 100 * 35 * 100;
  cameraPos.z = -camMS;
    cam.move(0, 0, cameraPos.z);
    if (!songFile.isPlaying() && currentT < songDuration) {
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
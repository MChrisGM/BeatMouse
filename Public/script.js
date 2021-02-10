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

let songInfo;

let mCombo;
let mNotes;
let noteHit;

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

let volume = 100;
let hitvolume = 100;

let combo = 0;
let combos = [0];
let missedNotes = 0;
let hit = 0;
let noteCount = 0;

let songNames = ['Beat_saber','Lone_Digger','PopStars'];
let songDifficulties = [[3],[1,2,3,4],[0,1,2,3,4]];
// let songIndex = 2;
let songName = songNames[1];
let modes = ['Easy','Normal','Hard','Expert','Expert+'];
let modeIndexs = [0,1,2,3,4];
let modeIndex = 1;

p5.disableFriendlyErrors = true;

window.onload = function(){

  if(localStorage.getItem('songName') != null){
    songName = localStorage.getItem('songName');
  }
  if (localStorage.getItem('modeIndex') != null){
    modeIndex = localStorage.getItem('modeIndex');
  }
  if (localStorage.getItem('volume') != null){
    volume = localStorage.getItem('volume');
  }
  if (localStorage.getItem('hitvolume') != null){
    hitvolume = localStorage.getItem('hitvolume');
  }

  var slider = document.getElementById("volumeSlider");
  var output = document.getElementById("demo");
  slider.value = volume;
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
    volume = this.value;
    localStorage.setItem('volume',volume);
  }

  var hitslider = document.getElementById("hitvolumeSlider");
  var hitoutput = document.getElementById("hitdemo");
  hitslider.value = hitvolume;
  hitoutput.innerHTML = hitslider.value;

  hitslider.oninput = function() {
    hitoutput.innerHTML = this.value;
    hitvolume = this.value;
    localStorage.setItem('hitvolume',hitvolume);
  }

  let songDropdown = document.getElementById("songDropdown");
  for (let element of songNames){
    let sEl = document.createElement("button");
    sEl.onclick = function() {setSong(element);};
    sEl.innerText = element;
    songDropdown.appendChild(sEl);
  }

  let levelDropdown = document.getElementById("levelDropdown");
  for (let element of modeIndexs){
    if(songDifficulties[songNames.indexOf(songName)].indexOf(element) > -1){
      let sEl = document.createElement("button");
      sEl.onclick = function() {setLevel(element);};
      sEl.innerText = modes[element];
      levelDropdown.appendChild(sEl);
    }
  }
}

function setSong(name){
  localStorage.setItem('songName',name);
  location.reload(true);
}
function setLevel(level){
  localStorage.setItem('modeIndex',level);
  location.reload(true);
}

function preload() {

  if(localStorage.getItem('songName') != null){
    songName = localStorage.getItem('songName');
  }
  if (localStorage.getItem('modeIndex') != null){
    modeIndex = localStorage.getItem('modeIndex');
  }
  if (localStorage.getItem('volume') != null){
    volume = localStorage.getItem('volume');
  }
  if (localStorage.getItem('hitvolume') != null){
    hitvolume = localStorage.getItem('hitvolume');
  }

  if (songDifficulties[songNames.indexOf(songName)].includes(parseInt(modeIndex)) == false){
    modeIndex = songDifficulties[songNames.indexOf(songName)][0];
  }

  infoFile = loadJSON("/songs/"+songName+"/Info.dat");
  songFile = loadSound('/songs/'+songName+'/song.ogg');

  if (modes[modeIndex] == modes[0]) {
    levelFile = loadJSON("/songs/"+songName+"/OneSaberEasy.dat");
  }else if (modes[modeIndex] == modes[1]) {
    levelFile = loadJSON("/songs/"+songName+"/OneSaberNormal.dat");
  } else if (modes[modeIndex] == modes[2]) {
    levelFile = loadJSON("/songs/"+songName+"/OneSaberHard.dat");
  } else if (modes[modeIndex] == modes[3]){
    levelFile = loadJSON("/songs/"+songName+"/OneSaberExpert.dat");
  }else if (modes[modeIndex] == modes[4]){
    levelFile = loadJSON("/songs/"+songName+"/OneSaberExpertPlus.dat");
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
  noteHit = document.createElement('p');
  noteHit.classList = 'stats';
  mNotes.classList = 'stats';
  mCombo.classList = 'stats';
  document.getElementById('rightContainer').appendChild(mNotes);
  document.getElementById('rightContainer').appendChild(noteHit);
  document.getElementById('rightContainer').appendChild(mCombo);

  songInfo = document.createElement("p");
  songInfo.id = "songInfo";
  songInfo.innerHTML = originalName+" - "+modes[modeIndex]+"<br>"+originalAuthor;
  document.body.appendChild(songInfo);

}

function windowResized() {
  initialize();
  leftContainer.position(width / 5, height / 2.5);
  rightContainer.position(4 * width / 5, height / 2.5);
}

let originalName;
let originalAuthor;

function setup() {

  frameRate(60);

  bpm = infoFile['_beatsPerMinute'];
  originalName = infoFile['_songName'];
  originalAuthor = infoFile['_songAuthorName'];

  songDuration = songFile.duration();
  beatLength = songDuration * (bpm / 60);
  setBPM(bpm);

  songFile.setVolume(volume/100 - 0.2);
  songFile.onended(stopMusic);

  let notes = levelFile['_notes'];
  for (let note of notes) {
    let time = note['_time'];
    let type = note['_type'];
    let lineIndex = note['_lineIndex'];
    let lineLayer = note['_lineLayer'];
    let cutDirection = note['_cutDirection'];
    let block = new Block(time, lineIndex, lineLayer, type, cutDirection);
    beats.push(block);
    if(type != 3){noteCount += 1;}
  }

  // beats.push(new Block(2, 1, 0, 1, 1)); //Debug note
  
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

}

function stopMusic(){
  songFile.stop();
  cam.setPosition(0,0,songOffset);
}

function draw() {
  background(15);

  if(volume/100 - 0.2 <= 0 ){
    songFile.setVolume(0);
  }else{
    songFile.setVolume(volume/100 - 0.2);
  }

  // push();
  // console.log(cam)
  // translate((-width/2)/cam.aspectRatio, (-height/2)/cam.aspectRatio, cam.eyeZ-500);
  // fill(255);
  // ellipse(mouseX,mouseY,10,10);
  // console.log(mouseX,mouseY);
  // console.log((-width/2)/cam.aspectRatio, (-height/2)/cam.aspectRatio);
  // pop()

  noStroke();
  fill(65);
  push();
  translate(0, 150, 0);
  box(350, 1, 1000000);
  pop();

  var currentT = songFile.currentTime();

  // console.log(songFile);

  timeProgress.innerText = format(currentT) + '/' + format(songDuration);

  let max = combos.reduce(function(a, b) {
    return Math.max(a, b);
  });

  if(combo > max){max = combo};

  mNotes.innerText = 'Missed notes: ' + missedNotes;
  noteHit.innerText = 'Notes hit: '+hit+"/"+noteCount;
  mCombo.innerText = 'Max combo: ' + max;

  scoreDiv.html('Combo<br>' + combo);
  progressBar.style.width = (currentT / songDuration) * 100 + '%';

  for (let block of beats) {
    if (!block.hit && !block.missed && cam.centerZ - block.pos.z < 3000 && cam.centerZ - block.pos.z > -2000) {
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
        hit += 1;
        continue;
      }
    }
  }

  for (let obstacle of obstacles) {
    if (cam.centerZ - obstacle.pos.z < 5000 && cam.centerZ - obstacle.pos.z > -10000) {
      obstacle.display();
    }
  }

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

  if (sp) {
    let camMS = (bpm / 60) * (1 / (beatLength)) / frameRate() * 100 * 35 * 100;
  cameraPos.z = -camMS;
    cam.move(0, 0, cameraPos.z);
    if (songFile.isPaused() || !songFile.isPlaying()) {
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



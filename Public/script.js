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
let mScore;

let song;
let infoFile;
let levelFile;
let sliceFile;
let drawable = false;

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
let score = 0;

let fpsCounter;

let songNames = ['Beat_saber',
  'Lone_Digger',
  'PopStars',
  'Crab_Rave',
  'RealityCheck'];

let songDifficulties = [[3],
[1, 2, 3, 4],
[0, 1, 2, 3, 4],
[1, 2, 3, 4],
[1, 2, 3, 4]];

let songName = songNames[1];
let modes = ['Easy', 'Normal', 'Hard', 'Expert', 'Expert+'];
let modeIndexs = [0, 1, 2, 3, 4];
let modeIndex = 1;

let username;

let originalName;
let originalAuthor;

p5.disableFriendlyErrors = true;

window.onload = function() {

  var slider = document.getElementById("volumeSlider");
  var output = document.getElementById("demo");
  slider.value = volume;
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
    volume = this.value;
    localStorage.setItem('volume', volume);
  }

  var hitslider = document.getElementById("hitvolumeSlider");
  var hitoutput = document.getElementById("hitdemo");
  hitslider.value = hitvolume;
  hitoutput.innerHTML = hitslider.value;

  hitslider.oninput = function() {
    hitoutput.innerHTML = this.value;
    hitvolume = this.value;
    localStorage.setItem('hitvolume', hitvolume);
  }

  fpsCounter = document.createElement('p');
  fpsCounter.id = "fps";
  document.body.appendChild(fpsCounter);

  let songDropdown = document.getElementById("songDropdown");
  for (let element of songNames) {
    let sEl = document.createElement("button");
    sEl.onclick = function() { setSong(element); };
    sEl.innerText = element;
    songDropdown.appendChild(sEl);
  }

  let levelDropdown = document.getElementById("levelDropdown");
  for (let element of modeIndexs) {
    if (songDifficulties[songNames.indexOf(songName)].indexOf(element) > -1) {
      let sEl = document.createElement("button");
      sEl.onclick = function() { setLevel(element); };
      sEl.innerText = modes[element];
      levelDropdown.appendChild(sEl);
    }
  }
}

function setSong(name) {
  localStorage.setItem('songName', name);
  location.reload(true);
}
function setLevel(level) {
  localStorage.setItem('modeIndex', level);
  location.reload(true);
}

async function preload() {

  if (localStorage.getItem('songName') != null) {
    songName = localStorage.getItem('songName');
  }
  if (localStorage.getItem('modeIndex') != null) {
    modeIndex = localStorage.getItem('modeIndex');
  }
  if (localStorage.getItem('volume') != null) {
    volume = localStorage.getItem('volume');
  }
  if (localStorage.getItem('hitvolume') != null) {
    hitvolume = localStorage.getItem('hitvolume');
  }
  if (localStorage.getItem('username') != null) {
    username = localStorage.getItem('username');
  } else {
    username = prompt("Please enter your username:");
    while (username == null || username == "") {
      username = prompt("Please enter your username:");
    }
    localStorage.setItem('username', username);
  }
  document.getElementById("usernameWelcome").innerHTML = "Welcome back, " + username + "!";

  if (songDifficulties[songNames.indexOf(songName)].includes(parseInt(modeIndex)) == false) {
    modeIndex = songDifficulties[songNames.indexOf(songName)][0];
  }

  if (modes[modeIndex] == modes[0]) {
    levelFile = loadJSON("/songs/" + songName + "/OneSaberEasy.dat");
  } else if (modes[modeIndex] == modes[1]) {
    levelFile = loadJSON("/songs/" + songName + "/OneSaberNormal.dat");
  } else if (modes[modeIndex] == modes[2]) {
    levelFile = loadJSON("/songs/" + songName + "/OneSaberHard.dat");
  } else if (modes[modeIndex] == modes[3]) {
    levelFile = loadJSON("/songs/" + songName + "/OneSaberExpert.dat");
  } else if (modes[modeIndex] == modes[4]) {
    levelFile = loadJSON("/songs/" + songName + "/OneSaberExpertPlus.dat");
  }

  infoFile = loadJSON("/songs/" + songName + "/Info.dat");
}


function initialize(resize) {

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  addScreenPositionFunction();

  if(cam != null){
    let cZ = cam.centerZ;
    cam = createCamera();
    cam.move(0, 0, cZ);
  }

  if (!resize) {
    cam = createCamera();
    cameraPos = createVector(0, 0, songOffset);
    cam.setPosition(cameraPos.x, cameraPos.y, cameraPos.z);
  }

  scaleX = width / 1920;
  scaleY = height / 1080;

  document.addEventListener('contextmenu', event => event.preventDefault());

}

function windowResized() {
  initialize(true);
  leftContainer.position(width / 5, height / 2.5);
  rightContainer.position(4 * width / 5, height / 2.5);
}

async function setup() {
  // Load slice file into memory for reuse
  sliceFile = await getSoundFile('sounds/HitShortRight2.ogg');

  // Load song
  const songFile = await getSoundFile('/songs/' + songName + '/song.ogg',
    e => {
      const percentageString = (e.loaded / e.total * 100).toFixed(1) + '%';
      document.querySelector("#loading-percentage").innerText = percentageString;
    });
  song = new Sound(songFile);
  await song.waitUntilLoaded();
  document.querySelector("#loading-percentage").innerText = "100%";

  frameRate(120);

  bpm = infoFile['_beatsPerMinute'];
  originalName = infoFile['_songName'];
  originalAuthor = infoFile['_songAuthorName'];

  songDuration = song.duration();

  if (songDuration == NaN) songDuration = 10000;
  beatLength = songDuration * (bpm / 60);

  song.setVolume(volume / 100 - 0.2);
  song.onended(stopMusic);

  placeNotes();

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

  progressBar = document.createElement("div");
  progressBar.classList = 'bar';

  timeProgress = document.createElement('p');
  timeProgress.id = 'timeProgress';

  mScore = document.createElement('p');
  mScore.classList = 'score';
  mScore.innerText = "Score\n0";
  mScore.style.fontSize = "3vw";

  document.getElementById('leftContainer').appendChild(mScore);
  scoreDiv.parent(leftContainer);
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
  songInfo.innerHTML = originalName + " - " + modes[modeIndex] + "<br>" + originalAuthor;
  document.body.appendChild(songInfo);

  drawable = true;
  document.querySelector("#loading-percentage").innerText = "";
}

function placeNotes() {
  noteCount = 0;
  beats = [];
  obstacles = [];
  let notes = levelFile['_notes'];
  for (let note of notes) {
    let time = note['_time'];
    let type = note['_type'];
    let lineIndex = note['_lineIndex'];
    let lineLayer = note['_lineLayer'];
    let cutDirection = note['_cutDirection'];
    let block = new Block(time, lineIndex, lineLayer, type, cutDirection);
    beats.push(block);
    if (type != 3) { noteCount += 1; }
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
}

function stopMusic() {
  song.stop();
  cam.setPosition(0, 0, songOffset);
  sp = false;
  placeNotes();
}

function draw() {
  if (!drawable) return;

  fpsCounter.innerText = Math.floor(frameRate());

  background(15);

  if (volume / 100 - 0.2 <= 0) {
    song.setVolume(0);
  } else {
    song.setVolume(volume / 100 - 0.2);
  }

  noStroke();
  fill(65);
  push();
  translate(0, 150, 0);
  box(350, 1, 1000000);
  pop();

  var currentT = song.time();

  timeProgress.innerText = format(currentT) + '/' + format(songDuration);

  let max = combos.reduce(function(a, b) {
    return Math.max(a, b);
  });

  if (combo > max) { max = combo };

  mNotes.innerText = 'Missed notes: ' + missedNotes;
  noteHit.innerText = 'Notes hit: ' + hit + "/" + noteCount;
  mCombo.innerText = 'Max combo: ' + max;

  scoreDiv.html('Combo<br>' + combo);
  progressBar.style.width = (currentT / songDuration) * 100 + '%';
  mScore.innerText = "Score\n" + score;

  for (let block of beats) {
    if (!block.hit && !block.missed && cam.centerZ - block.pos.z < 3000 && cam.centerZ - block.pos.z > -2000) {
      block.display();
      block.collision();
      if (block.missed && block.type != 3) {
        combos.push(parseInt(combo));
        combo = 0;
        missedNotes += 1;
        continue;
      }
      if (block.missed && block.type == 3) {
        combos.push(parseInt(combo));
        combo = 0;
        continue;
      }
      if (block.score > 0) {
        combo += 1;
        hit += 1;

        if (combo == 0) {
          score += block.score;
        }
        else if (combo > 0 && combo <= 7) {
          score += (block.score * combo);
        } else {
          score += (block.score * 8);
        }
        score = Math.floor(score);
        continue;
      }
    }
  }

  for (let obstacle of obstacles) {
    if (cam.centerZ - obstacle.pos.z < 5000 && cam.centerZ - obstacle.pos.z > -10000) {
      obstacle.display();
    }
  }

  if (keycodeIsDown('ShiftLeft')) { //Shift
    cam.setPosition(cam.eyeX, 40, cam.eyeZ);
  } else {
    cam.setPosition(cam.eyeX, 0, cam.eyeZ);
  }
  if (keycodeIsDown('KeyA')) { //A
    cam.setPosition(-40, cam.eyeY, cam.eyeZ);
  } else if (keycodeIsDown('KeyD')) { //D
    cam.setPosition(40, cam.eyeY, cam.eyeZ);
  } else if(keycodeIsDown('KeyE')){ //E
    cam.setPosition(20, cam.eyeY, cam.eyeZ);
  } else if(keycodeIsDown('KeyQ')){ //Q
    cam.setPosition(-20, cam.eyeY, cam.eyeZ);
  } else {
    cam.setPosition(0, cam.eyeY, cam.eyeZ);
  }

  if (sp) {
    let camMS = (bpm / 60) * (1 / (beatLength)) / frameRate() * 100 * 35 * 100;
    cameraPos.z = -camMS;
    cam.move(0, 0, cameraPos.z);
    if (song.isPaused()) {
      resetStats();
      song.play();
    }
    else if (!song.isPlaying()) {
      song.play();
    }
  } else {
    if (song.isPlaying()) {
      song.pause();
    }
  }
}

function resetStats() {
  combo = 0;
  combos = [0];
  missedNotes = 0;
  hit = 0;
  score = 0;
}

function keyPressed() {
  if (keyCode == 32) { //Space
    sp = !sp;
  }
}
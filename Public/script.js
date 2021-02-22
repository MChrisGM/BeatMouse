let canvas;
let cam;
let cameraPos;

let speedM = 2;

let hitboxOffset = 30;

const Y_AXIS = 1;
const X_AXIS = 2;

let scaleX;
let scaleY;

let hitIndicator;
let fullCtoggle;
let displayObstacles;

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
let layers = [55, 15, -35];

let sp = false;

let songOffset = 0;

let volume = 100;
let hitvolume = 100;

let combo = 0;
let combos = [0];
let missedNotes = 0;
let hit = 0;
let noteCount = 0;
let score = 0;

let fpsCounter;

let levelScheme = {
  'L': [255, 0, 0],
  'R': [0, 0, 255],
  'W': [255, 0, 0],
};

let environments = {
  'DefaultEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'OriginsEnvironment': {
    'L': [255, 255, 0],
    'R': [255, 0, 255],
    'W': [255, 0, 0],
  },
  'TriangleEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'NiceEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'BigMirrorEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'DragonsEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'KDAEnvironment': {
    'L': [255, 128, 0],
    'R': [127, 0, 255],
    'W': [255, 0, 0],
  },
  'MonstercatEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'CrabRaveEnvironment': {
    'L': [0, 255, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'PanicEnvironment': {
    'L': [255, 0, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'RocketEnvironment': {
    'L': [255, 128, 0],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'GreenDayEnvironment': {
    'L': [0, 255, 0],
    'R': [0, 255, 255],
    'W': [255, 0, 0],
  },
  'GreenDayGrenadeEnvironment': {
    'L': [0, 255, 0],
    'R': [0, 255, 255],
    'W': [255, 0, 0],
  },
  'TimbalandEnvironment': {
    'L': [128, 128, 128],
    'R': [0, 0, 255],
    'W': [255, 0, 0],
  },
  'FitBeatEnvironment': {
    'L': [255, 255, 0],
    'R': [255, 0, 255],
    'W': [255, 0, 0],
  },
  'LinkinParkEnvironment': {
    'L': [255, 0, 0],
    'R': [51, 153, 255],
    'W': [255, 0, 0],
  },
  'BTSEnvironment': {
    'L': [255, 0, 255],
    'R': [127, 0, 255],
    'W': [255, 0, 0],
  },
  'GlassDesertEnvironment': {
    'L': [255, 255, 0],
    'R': [255, 0, 255],
    'W': [255, 0, 0],
  }

};

let songNames = ['Beat_Saber',
  'Lone_Digger',
  'Pop_Stars',
  'Crab_Rave',
  'Reality_Check',
  'Megalovania',
  'Sandstorm',
  'Time_Lapse', //Max score: 512200
  'High_Hopes',
  'Dance_with_Silence',
  'Mayday',
  'More',
  'Mario_Kart'];

let songName = songNames[2];
let modes = ['Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus'];
let modeIndexs = [0, 1, 2, 3, 4];
let modeIndex = 0;

let username;

let originalName;
let originalAuthor;

let enableTrail = true;

p5.disableFriendlyErrors = true;

window.onload = function() {
  
  var slider = document.getElementById("volumeSlider");
  var output = document.getElementById("demo");
  slider.value = volume;
  output.innerHTML = slider.value;
  slider.style.display = "none";

  slider.oninput = function() {
    output.innerHTML = this.value;
    volume = this.value;
    localStorage.setItem('volume', volume);
  }

  var hitslider = document.getElementById("hitvolumeSlider");
  var hitoutput = document.getElementById("hitdemo");
  hitslider.value = hitvolume;
  hitoutput.innerHTML = hitslider.value;
  hitslider.style.display = "none";

  hitslider.oninput = function() {
    hitoutput.innerHTML = this.value;
    hitvolume = this.value;
    localStorage.setItem('hitvolume', hitvolume);
  }

  fpsCounter = document.createElement('p');
  fpsCounter.id = "fps";
  document.body.appendChild(fpsCounter);
  
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
  // document.getElementById("usernameWelcome").innerHTML = "Welcome back, " + username + "!";
  // document.getElementById("usernameWelcome").style.display = "none";

  if (localStorage.getItem('hitIndicator') != null) {
    hitIndicator = localStorage.getItem('hitIndicator') == 'false'
      ? false : true;
  } else { hitIndicator = false; }
  document.getElementById("SliceInd").checked = hitIndicator;

  if (localStorage.getItem('fullCtoggle') != null) {
    fullCtoggle = localStorage.getItem('fullCtoggle') == 'false'
      ? false : true;
  } else { fullCtoggle = false; }
  document.getElementById("fullCtoggle").checked = fullCtoggle;

  if (localStorage.getItem('displayObstacles') != null) {
    displayObstacles = localStorage.getItem('displayObstacles') == 'false'
      ? false : true;
  } else { displayObstacles = true; }
  document.getElementById("displayObstacles").checked = displayObstacles;

  if (localStorage.getItem('enableTrail') != null) {
    enableTrail = localStorage.getItem('enableTrail') == 'false'
      ? false : true;
  } else { enableTrail = true; }
  document.getElementById("enableTrail").checked = enableTrail;

  
  infoFile = loadJSON("/songs/" + songName + "/Info.dat", loadMap);
}

let songFileName = '';
let currentDifficulties = [];

function loadMap(){
  songFileName = infoFile['_songFilename'];

  let beatMapSets = infoFile['_difficultyBeatmapSets'];

  for (let mapset of beatMapSets){
    if(mapset['_beatmapCharacteristicName'] == 'OneSaber'){
      for(let diffs of mapset['_difficultyBeatmaps']){
        currentDifficulties.push(modeIndexs[modes.indexOf(diffs['_difficulty'])]);
      }
    }
  }
  if (currentDifficulties.includes(parseInt(modeIndex)) == false) {
    modeIndex = currentDifficulties[0];
  }
  for (let mapset of beatMapSets){
    if(mapset['_beatmapCharacteristicName'] == 'OneSaber'){
      for(let diffs of mapset['_difficultyBeatmaps']){
        if (diffs['_difficulty'] == modes[modeIndex]){
          levelFile = loadJSON("/songs/" + songName+"/" + diffs['_beatmapFilename']);
        }
      }
    }
  }

  setMapnameDropdown();
  setDifficultyDropdown();

}

function setMapnameDropdown(){
  let songDropdown = document.getElementById("songDropdown");
  for (let element of songNames) {
    let sEl = document.createElement("button");
    sEl.onclick = function() { setSong(element); };
    sEl.innerText = element.replaceAll("_", " ");
    songDropdown.appendChild(sEl);
  }
}

function setDifficultyDropdown(){
  let levelDropdown = document.getElementById("levelDropdown");
  for (let element of modeIndexs) {
    if (currentDifficulties.indexOf(element) > -1) {
      let sEl = document.createElement("button");
      sEl.onclick = function() { setLevel(element); };
      sEl.innerText = modes[element];
      levelDropdown.appendChild(sEl);
    }
  }
}

let camScale;

function initialize(resize) {

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  addScreenPositionFunction();

  if (cam != null) {
    let cZ = cam.centerZ;
    cam = createCamera();
    camScale = ((100-cam.cameraNear)/100)+1;
    cam.move(0, 0, cZ);
  }

  if (!resize) {
    cam = createCamera();
    camScale = ((100-cam.cameraNear)/100)+1;
    cameraPos = createVector(0, 0, 0);
    cam.setPosition(0, 0, 0);
  }

  scaleX = width / 1920;
  scaleY = height / 1080;

  cam.move(0,0,((height/2)-100)*camScale);

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
  const songFile = await getSoundFile('/songs/' + songName + '/'+songFileName,
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

  for (let env of Object.entries(environments)) {
    let name = env[0] + '';
    if (name.includes(infoFile['_environmentName'])) {
      levelScheme = env[1];
    }
  }

  let beatMapSets = infoFile['_difficultyBeatmapSets'];
  for (let mapSet of beatMapSets) {
    if (mapSet['_beatmapCharacteristicName'] == 'OneSaber') {
      for (let diff of mapSet['_difficultyBeatmaps']) {
        if (diff['_difficulty'] == modes[modeIndex]) {
          let customData = diff['_customData'];
          if (customData) {
            if (customData['_colorLeft']) {
              let c = customData['_colorLeft'];
              levelScheme['L'] = [
                Math.floor(c['r'] * 255),
                Math.floor(c['g'] * 255),
                Math.floor(c['b'] * 255)];
            }
            if (customData['_colorRight']) {
              let c = customData['_colorRight'];
              levelScheme['R'] = [
                Math.floor(c['r'] * 255),
                Math.floor(c['g'] * 255),
                Math.floor(c['b'] * 255)];
            }
            if (customData['_obstacleColor']) {
              let c = customData['_obstacleColor'];
              levelScheme['W'] = [
                Math.floor(c['r'] * 255),
                Math.floor(c['g'] * 255),
                Math.floor(c['b'] * 255)];
            }
          }
        }
      }
    }
  }

  // console.log(levelScheme);

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

  let c = levelScheme;

  for(let div of document.getElementsByClassName('trail')){
    div.style.background = rgbToHex(c['R'][0], c['R'][1], c['R'][2]);
  }

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

  // beats.push(new Block(2,1,0,0,1));

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
  cam.move(0,0,((height/2)-100)*camScale);
}

addEventListener('unload', () => {
  // Remember, this code has to be synchronous
  localStorage.setItem('hitIndicator', hitIndicator);
  localStorage.setItem('fullCtoggle', fullCtoggle);
  localStorage.setItem('displayObstacles', displayObstacles);
  localStorage.setItem('enableTrail', enableTrail);
});

function draw() {
  if (!drawable) return;

  fpsCounter.innerText = Math.floor(frameRate());

  hitIndicator = document.getElementById("SliceInd").checked;
  fullCtoggle = document.getElementById("fullCtoggle").checked;
  displayObstacles = document.getElementById("displayObstacles").checked;
  enableTrail = document.getElementById("enableTrail").checked;

  background(15);

  if (volume / 100 - 0.2 <= 0) {
    song.setVolume(0);
  } else {
    song.setVolume(volume / 100 - 0.2);
  }

  
  // noStroke();
  push();
  translate(0,-80,80*camScale);
  fill(40);
  stroke(50)
  push();
  translate(0, 190, cam.centerZ-2800);
  box(190, 21, 6000);
  pop();
  push();
  translate(-120,530,cam.centerZ+169);
  box(50,700,65);
  pop();
  push();
  translate(120,530,cam.centerZ+169);
  box(50,700,65);
  pop();
  push();
  translate(-120,580,cam.centerZ-700);
  box(50,800,65);
  pop();
  push();
  translate(120,580,cam.centerZ-700);
  box(50,800,65);
  pop();
  push();
  fill(60);
  translate(0,190,cam.centerZ+700);
  box(170,20,300);
  pop();
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

        if (fullCtoggle) {
          stopMusic();
        }

        continue;
      }
      if (block.missed && block.type == 3) {
        combos.push(parseInt(combo));
        combo = 0;

        if (fullCtoggle) {
          stopMusic();
        }

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

  if (displayObstacles) {
    for (let obstacle of obstacles) {
      obstacle.display();
    }
  }

  if (keycodeIsDown('ShiftLeft')) { //Shift
    if (cam.eyeY < 35) {
      cam.setPosition(cam.eyeX, cam.eyeY + 5, cam.eyeZ);
    }
  } else {
    if (cam.eyeY > 5) {
      cam.setPosition(cam.eyeX, cam.eyeY - 5, cam.eyeZ);
    }
  }
  if (keycodeIsDown('KeyA')) { //A
    if (cam.eyeX > -35) {
      cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
    }
  } else if (keycodeIsDown('KeyD')) { //D
    if (cam.eyeX < 35) {
      cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
    }
  } else if (keycodeIsDown('KeyE')) { //E
    if (cam.eyeX < 15) {
      cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
    }
  } else if (keycodeIsDown('KeyQ')) { //Q
    if (cam.eyeX > -15) {
      cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
    }
  } else {
    if (cam.eyeX > 5) {
      cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
    }
    if (cam.eyeX < -5) {
      cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
    }
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

    if(enableTrail){
      drawTrail();
    }else{
      hideTrail();
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
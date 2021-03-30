let beatFont;
let neonFont;

// let blockModel;
let mineModel;
let blockModelDir;
let blockModelCen;

let userInfo;

let userAvatar = new Image;
    
p5.disableFriendlyErrors = true;

async function preload() {
  beatFont = loadFont("styles/Teko-Regular.ttf");
  neonFont = loadFont("styles/NeonTubes2.otf");

  if (localStorage.getItem('userData') != null) {
    userInfo = JSON.parse(localStorage.getItem('userData'));
    userAvatar.src = `https://cdn.discordapp.com/avatars/${userInfo['USER_ID']}/${userInfo['USER_AVATAR']}.png`;
    userAvatar = loadImage(userAvatar.src);
    loggedIn = true;
  } else {
    userInfo = null;
    loggedIn = false;
  }

  loadOptions();

  let listGettingPromise = getList();
  songs = await listGettingPromise;
  songs.sort((a, b) => a.name.localeCompare(b.name));

  if (options['song_Name'] == '') {
    options['song_Name'] = songs[0]['name'];
  }

  let selected_Song;
  for (const i of songs) {
    if (i['name'] == options['song_Name']) {
      selected_Song = i;
    }
  }

  // blockModel = loadModel("assets/block.stl");
  mineModel = loadModel("assets/mine.obj");
  blockModelDir = loadModel("assets/block-directional.obj");
  blockModelCen = loadModel("assets/block-center.obj");

  sliceFile = await getSoundFile('sounds/HitShortRight2.ogg');

  await loadSong(selected_Song);
  prld = true;
}

async function loadSong(sng) {

  loading = true;
  loaded = false;

  let songGettingPromise = getSong(sng);
  songFiles = await songGettingPromise;

  // song_infoDat = JSON.parse(await (songFiles.get('Info.dat')).text()) || JSON.parse(await (songFiles.get('info.dat')).text());

  song_infoDat = JSON.parse(
    (await (songFiles.get('Info.dat') || songFiles.get('info.dat')).text())
  );

  song_cover = songFiles.get(song_infoDat['_coverImageFilename']);
  song_cover = await loadImage(URL.createObjectURL(song_cover));

  difficulties = [];
  beatmap = null;
  selected_difficulty = options["song_Difficulty"] || null;
  let beatMapSets = song_infoDat['_difficultyBeatmapSets'];
  for (let mapset of beatMapSets) {
    if (mapset['_beatmapCharacteristicName'] == 'OneSaber') {
      for (let diffs of mapset['_difficultyBeatmaps']) {
        let flnm = diffs['_beatmapFilename'];
        let diffName = diffs['_difficulty'];
        difficulties.push(
          new clickText(createVector(), createVector(), 50, diffName, async function() {
            selected_difficulty = this.txt;
            beatmap = JSON.parse(await (songFiles.get(flnm)).text());
            options["song_Difficulty"] = selected_difficulty;
            saveOptions();
          }, false)
        );
        if (diffName == selected_difficulty) {
          beatmap = JSON.parse(await (songFiles.get(flnm)).text());
        }
      }
    }
  }

  // console.log(difficulties);

  bpm = song_infoDat['_beatsPerMinute'];

  // await loadAudio(sng);

  loading = false;
  loaded = true;
}

async function loadAudio(sng){
  downloadingSong = true;
  song_audio = (await getAudio(sng)).get(song_infoDat['_songFilename']);
  song_audio = new Sound(URL.createObjectURL(song_audio));

  songDuration = await new Promise((resolve, reject) => {
    setTimeout(function() {
      if (!isNaN(song_audio.duration())) {
        resolve(song_audio.duration());
      }
    }, 1000);
  });
  if (isNaN(songDuration)) {
    songDuration = 1000;
  }
  beatLength = songDuration * (bpm / 60);
  song_audio.setVolume(options.song_Volume.value / 100);
  song_audio.onended(stopMusic);
  downloadingSong = false;
}

function setup() {

  document.oncontextmenu = function() { return false; }

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();

  smooth();

  background(0);

  // blockModel.averageNormals();
  // blockModel.computeNormals();

  fpsCounter = document.createElement('p');
  fpsCounter.id = "fps";
  document.body.appendChild(fpsCounter);

  stp = true;
}

function windowResized() {
  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();
}


function draw() {
  background(0);
  player_movement();

  fpsCounter.innerText = Math.floor(frameRate());

  let xSc = window.innerWidth / 1920;
  let ySc = window.innerHeight / 1080;
  // scale(xSc, ySc, Math.hypot(xSc,ySc));
  scale(xSc, ySc, 1);

  pointLight(255, 255, 255, 0, 0, 800);

  //Floor
  push();
  specularMaterial(10, 93, 171);
  shininess(5);
  translate(0, 200, 800);
  rotateX(PI / 2);
  plane(600, 650, 2, 2);
  pop();



  switch (canvasState) {
    case MENU:
      menu();
      break;
    case GAME:
      game();
      break;
    case ENDSCREEN:
      endScreen();
      break;
    case LOADING:
      break;
    default:
      menu();
      break;
  }
}


function menu() {

  mainMenu(
    createVector(0, 0, -300),
    createVector(0, 0, 0),
  );

  settings(
    createVector(-800 * Math.sin(PI / 2), 0, -800 * Math.cos(PI / 2)),
    createVector(0, PI / 4, 0)
  );

  leaderboard(
    createVector(-800 * Math.sin(-PI / 2), 0, -800 * Math.cos(-PI / 2)),
    createVector(0, -PI / 4, 0)
  );

  logo();

}


function game() {

  // pointLight(255, 255, 255, 0, 0, cam.eyeZ);

  if (intro) {
    if (intro_time >= 3 ) {
      intro = false;
      sp = true;
    }else if (intro_time >= 2 && intro_time < 3) {
      countdown(1);
    }else if (intro_time >= 1 && intro_time < 2) {
      countdown(2);
    }else if (intro_time >= 0 && intro_time < 1) {
      countdown(3);
    }
    intro_time += 1 / frameRate();
  }

  scorePlane(
    createVector(0, 0, -500),
    createVector(0, 0, 0),
  );

  platform();
  displayMap();

  if (sp && !paused) {
    objectVelocity = (bpm / 60) * (1 / (beatLength)) / frameRate() * 100 * 35 * 100;
    if (song_audio.isPaused()) {
      song_audio.play();
    }
    else if (!song_audio.isPlaying()) {
      song_audio.play();
    }
    if(enableTrail){
      drawTrail();
    }else{
      hideTrail();
    }
  } else {
    if (song_audio.isPlaying()) {
      objectVelocity = 0;
      song_audio.pause();
    }if(!intro){
      pauseMenu(
        createVector(0, 0, 300),
        createVector(0, 0, 0),
    );
    }
  }
}

function endScreen() {
  results(
    createVector(0, 0, -300),
    createVector(0, 0, 0),
  );
}

function keyPressed() {
  if (keyCode == 32) { //Space
    paused = true;
  }
}

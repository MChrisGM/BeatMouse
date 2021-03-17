let beatFont;
let neonFont;

p5.disableFriendlyErrors = true;

async function preload() {
  beatFont = loadFont("styles/Teko-Regular.ttf");
  neonFont = loadFont("styles/NeonTubes2.otf");

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

  await loadSong(selected_Song);
  prld = true;
}

async function loadSong(sng) {

  loading = true;
  loaded = false;

  let songGettingPromise = getSong(sng);
  songFiles = await songGettingPromise;

  song_infoDat = JSON.parse(await (songFiles.get('Info.dat')).text()) || JSON.parse(await (songFiles.get('info.dat')).text());

  song_audio = songFiles.get(song_infoDat['_songFilename']);  
  song_audio = new Sound(URL.createObjectURL(song_audio));

  song_cover = songFiles.get(song_infoDat['_coverImageFilename']);
  song_cover = await loadImage(URL.createObjectURL(song_cover));

  difficulties = [];
  beatmap = null;
  selected_difficulty = options["song_Difficulty"]||null;
  let beatMapSets = song_infoDat['_difficultyBeatmapSets'];
  for (let mapset of beatMapSets){
    if(mapset['_beatmapCharacteristicName'] == 'OneSaber'){
      for(let diffs of mapset['_difficultyBeatmaps']){
        let flnm = diffs['_beatmapFilename'];
        let diffName = diffs['_difficulty'];
        difficulties.push(
          new clickText(createVector(), createVector(), 50, diffName, async function() {
            selected_difficulty = this.txt;
            beatmap = JSON.parse(await (songFiles.get(flnm)).text());
            options["song_Difficulty"] = selected_difficulty;
            saveOptions();
          },false)
        );
        if(diffName == selected_difficulty){
          beatmap = JSON.parse(await (songFiles.get(flnm)).text());
        }
      }
    }
  }

  loading = false;
  loaded = true;
}




function setup() {

  document.oncontextmenu = function() { return false; }

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();

  smooth();

  background(0);

  stp = true;
}

function windowResized() {
  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();
}


function draw() {
  player_movement();
  let xSc = window.innerWidth / 1920;
  let ySc = window.innerHeight / 1080;
  // scale(xSc, ySc, Math.hypot(xSc,ySc));
  scale(xSc, ySc, 1);

  switch (canvasState) {
    case MENU:
      menu();
      break;
    case GAME:
      game();
      break;
    case LOADING:
      break;
    default:
      menu();
      break;
  }
}


function menu() {
  background(0);
  // pointLight(80, 155, 255, 0, 0, cam.eyeZ);
  pointLight(255, 255, 255, 0, 0, cam.eyeZ);
  // lights();

  //Floor
  push();
  specularMaterial(10, 93, 171);
  shininess(5);
  translate(0, 200, cam.eyeZ);
  rotateX(PI / 2);
  plane(900, 750, 2, 2);
  pop();

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
  background(0);




}
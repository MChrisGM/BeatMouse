let beatFont;
let neonFont;

p5.disableFriendlyErrors = true;

async function preload() {

  console.log("Preload called");

  beatFont = loadFont("styles/Teko-Regular.ttf");
  neonFont = loadFont("styles/NeonTubes2.otf");

  loadOptions();

  let listGettingPromise = getList();
  songs = await listGettingPromise;

  songs.sort((a, b) => a.name.localeCompare(b.name));

  // console.log(songs);
  console.log(options)

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

  console.log("Preload finished");
  prld = true;
}



async function loadSong(sng) {
  console.log("Loading: ", sng);
  
  loading = true;
  loaded = false;

  let songGettingPromise = getSong(sng);
  songFiles = await songGettingPromise;

  song_infoDat = JSON.parse(await (songFiles.get('Info.dat')).text()) || JSON.parse(await (songFiles.get('info.dat')).text());

  song_audio = songFiles.get(song_infoDat['_songFilename']);  
  song_audio = new Sound(URL.createObjectURL(song_audio));

  song_cover = songFiles.get(song_infoDat['_coverImageFilename']);
  song_cover = await loadImage(URL.createObjectURL(song_cover));

  loading = false;
  loaded = true;
}




function setup() {

  console.log("Setup called");

  document.oncontextmenu = function() { return false; }

  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();

  background(0);

  console.log("Setup finished");
  stp = true;
}

function windowResized() {
  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();
}


function draw() {
  player_movement();
  scale((window.innerWidth / 1920), (window.innerHeight / 1080), 1);

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
  lights();

  //Floor
  push();
  specularMaterial(80, 155, 255);
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

}
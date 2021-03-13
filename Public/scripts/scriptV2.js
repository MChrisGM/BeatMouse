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

  if (options['song_Name'] == '') {
    options['song_Name'] = songs[0]['name'];
  }

  let selected_Song;

  for (const i of songs) {
    if (i['name'] == options['song_Name']) {
      selected_Song = i;
    }
  }

  let songGettingPromise = getSong(selected_Song);
  songFiles = await songGettingPromise;

  song_infoDat = JSON.parse(await (songFiles.get('Info.dat')).text()) || JSON.parse(await (songFiles.get('info.dat')).text());

  song_audio = songFiles.get(song_infoDat['_songFilename']);
  song_audio = new Sound(URL.createObjectURL(song_audio));
  // await song_audio.waitUntilLoaded();

  console.log("Preload finished");
  prld = true;
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

function windowResized(){
  canvas = createCanvas(innerWidth, innerHeight, WEBGL);
  cam = createCamera();
  addScreenPositionFunction();
}


function draw() {
  // if(!prld){return;}

  player_movement();

  scale((window.innerWidth/1920),(window.innerHeight/1080),1);

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

  pointLight(80, 155, 255, 0, 0, cam.eyeZ);

  //Floor
  push();
  specularMaterial(100);
  shininess(1);
  translate(0, 200, cam.eyeZ);
  rotateX(PI / 2);
  plane(900, 750, 2, 2);
  pop();

  mainMenu(
    createVector(0, 0, -300),
    createVector(0,0,0),
  );

  settings(
    createVector(-800 * Math.sin(PI / 2), 0, -800 * Math.cos(PI / 2)),
    createVector(0,PI/4,0)
  );

  leaderboard(
    createVector(-800 * Math.sin(-PI / 2), 0, -800 * Math.cos(-PI / 2)),
    createVector(0,-PI/4,0)
  );
  
  logo();
  
}

function mainMenu(p,r){
  //Main menu
  push();
  translate(p.x,p.y,p.z);
  rotateX(r.x);
  rotateY(r.y);
  rotateZ(r.z);
  fill(255, 255, 255, 200);
  plane(900, 600, 2, 2);
  pop();

  if(!prld){
    new clickText(p,r, 300, "Loading...");
  }else{
    new clickText(p,r, 300, "Start", function() {

  });
  }
}


function game() {

}



//----------------------Load & Save Game Options-------------------------------------
function loadOptions() {
  if (localStorage.getItem('options') != null) {
    options = JSON.parse(localStorage.getItem('options'));
    if (options['app_version'] <= version) {
      options = default_options;
    } else {
      console.error("Outdated client! Try refreshing the page.");
    }
  } else {
    options = default_options;
  }
  saveOptions();
}

function saveOptions() {
  localStorage.setItem('options', JSON.stringify(options));
}
//----------------------------------------------------------------------------------------
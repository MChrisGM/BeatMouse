function logo() {
  push();
  translate(0, -800 + 180 / 3, -400);
  rotateX(-0.25);
  fill(255, 0, 0);
  textFont(neonFont);
  textSize(180);
  textStyle(BOLD);
  textAlign(CENTER)
  shininess(1);
  text("Beat", 0, 0);
  pop();

  push();
  translate(0, -600 + 180 / 3, -400);
  rotateX(-0.3);
  fill(0, 0, 255);
  textFont(neonFont);
  textSize(180);
  textStyle(BOLD);
  textAlign(CENTER)
  shininess(1);
  text("Mouse", 0, 0);
  pop();
}

function settings(p, r) {
  //Settings menu
  push();
  translate(p.x, p.y, p.z);
  rotateY(r.y);
  rotateX(r.x);
  rotateZ(r.z);
  fill(60, 135, 235, 200);
  plane(750, 550, 2, 2)
  pop();
  new clickText(createVector(p.x, p.y - 200, p.z), createVector(r.x, r.y, r.z), 100, "Settings", false, false).display();
}

function leaderboard(p, r) {
  //Leaderboard menu
  push();
  translate(p.x, p.y, p.z);
  rotateY(r.y);
  rotateX(r.x);
  rotateZ(r.z);
  fill(60, 135, 235, 200);
  plane(750, 550, 2, 2)
  pop();
  new clickText(createVector(p.x, p.y - 200, p.z), createVector(r.x, r.y, r.z), 100, "Leaderboard", false, false).display();

  if (!loggedIn) {
    new clickText(createVector(p.x, p.y, p.z), createVector(r.x, r.y, r.z), 70, "Log in with Discord", function() {
      loggedIn = true;
      window.location.href = loginURL;
    }, false).display();
  }else{
    new clickText(createVector(p.x-150, p.y + 200, p.z), createVector(r.x, r.y, r.z), 50, "Logged in as: "+userInfo.USER_NAME+"#"+userInfo.USER_DISC, false, false).display();

    new clickText(createVector(p.x-320, p.y-180, p.z), createVector(r.x, r.y, r.z), 40, "Log out", function() {
      localStorage.removeItem("userData");
      loggedIn = false;
      window.location.href = "/";
    }, false).display();
  }


}

function mainMenu(p, r) {
  //Main menu
  push();
  translate(p.x, p.y, p.z);
  rotateX(r.x);
  rotateY(r.y);
  rotateZ(r.z);
  fill(60, 135, 235, 200);
  plane(900, 600, 2, 2);
  pop();

  if (!prld && !strt) {
    new clickText(p, r, 300, "Loading...", false, false).display();
  } else if (prld && !strt) {
    new clickText(p, r, 300, "Start", function() {
      strt = true;
    }, false).display();
  }

  if (strt) {
    scrollMenu(p, r);
  }
}


function scrollMenu(p, r) {
  let lst = displaySongs();

  p.y -= 300;

  let ys = [35, 100, 200, 300, 400, 500, 565];

  let xOffset = 270;

  if (loaded) {
    displaySongInfo(p, r);
  } else {
    new clickText(createVector(p.x + 200, p.y + ys[3], p.z), r, 100, "Loading...", false, false).display();
  }

  p.x -= xOffset;

  new clickText(createVector(p.x, p.y + ys[0], p.z), r, 80, "^", function() {
    if (scrollIdx > 0) {
      scrollIdx -= 0.2;
    }
  }, false, false).display();

  for (let i = 0; i < lst.length; i++) {
    let nme;
    if (song_infoDat['_songName'].length > 15) {
      nme = song_infoDat['_songName'].substring(0, 15);
    } else { nme = song_infoDat['_songName']; }

    if (nme.replaceAll("_", " ") == lst[i].txt) {
      lst[i].highlight = true;
      lst[i].border = true;
    } else {
      lst[i].highlight = false;
      lst[i].border = false;
    }

    lst[i].pos = createVector(p.x, p.y, p.z);
    lst[i].pos.y += ys[i + 1];
    lst[i].rot = r;
    lst[i].calcB();
    lst[i].display();
  }
  new clickText(createVector(p.x, p.y + ys[6], p.z), r, 80, "v", function() {
    if (scrollIdx < songs.length - 4) {
      scrollIdx += 0.2;
    }
  }, false, false).display();
}

function displaySongInfo(p, r) {
  //Cover image
  push();
  translate(p.x + 275, p.y + 150, p.z + 1);
  texture(song_cover);
  plane(200, 200);
  pop();

  //Modes
  let ys = [100, 180, 260, 340, 420];
  for (let i = 0; i < difficulties.length; i++) {
    if (selected_difficulty == difficulties[i].txt) {
      difficulties[i].highlight = true;
      difficulties[i].border = true;
    } else {
      difficulties[i].highlight = false;
      difficulties[i].border = false;
    }
    difficulties[i].pos = createVector(p.x, p.y + 20, p.z);
    difficulties[i].pos.y += ys[i + 1];
    difficulties[i].rot = r;
    difficulties[i].calcB();
    difficulties[i].display();
  }

  //Text and lines
  push();
  translate(p.x, p.y, p.z);
  rotateX(r.x);
  rotateY(r.y);
  rotateZ(r.z);
  stroke(255);
  strokeWeight(5);
  line(-100, 50, -100, 550);
  line(100, 50, 100, 550);
  pop();

  let nme = song_infoDat['_songName'].substring(0, 16);
  let authr = song_infoDat['_songAuthorName'].substring(0, 14);

  new clickText(createVector(p.x + 275, p.y + 275, p.z + 1), r, 60, nme, false, false).display();
  new clickText(createVector(p.x + 275, p.y + 325, p.z + 1), r, 60, "By " + authr, false, false).display();
  new clickText(createVector(p.x + 275, p.y + 375, p.z + 1), r, 60, "BPM: " + parseInt(song_infoDat['_beatsPerMinute']), false, false).display();

  if (beatmap) {
    let noteNmr = beatmap['_notes'].length;
    new clickText(createVector(p.x + 275, p.y + 425, p.z + 1), r, 60, "Notes: " + parseInt(noteNmr), false, false).display();

    new clickText(createVector(p.x + 275, p.y + 525, p.z + 1), r, 100, "Play", function() {
      setEnvironmentSettings();
      generateNotes();
      windowResized();

      canvasState = GAME;
    }, true).display();
  }

}

function setEnvironmentSettings(){
  for (let env of Object.entries(environments)) {
    let name = env[0] + '';
    if (name.includes(song_infoDat['_environmentName'])) {
      levelScheme = env[1];
    }
  }

  let beatMapSets = song_infoDat['_difficultyBeatmapSets'];
  for (let mapSet of beatMapSets) {
    if (mapSet['_beatmapCharacteristicName'] == 'OneSaber') {
      for (let diff of mapSet['_difficultyBeatmaps']) {
        if (diff['_difficulty'] == selected_difficulty) {
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
}

function generateNotes() {

  noteCount = 0;
  beats = [];
  obstacles = [];
  let notes = beatmap['_notes'];
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

  let obs = beatmap['_obstacles'];
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

function platform(){
  push();
    translate(0,-80,80);
    fill(40);
    stroke(50)
    push();
      translate(0, 190, -2800);
      box(290, 21, 6000);
    pop();
    push();
      translate(-120,530,169);
      box(50,700,65);
    pop();
    push();
      translate(120,530,169);
      box(50,700,65);
    pop();
    push();
      translate(-120,580,700);
      box(50,800,65);
    pop();
    push();
      translate(120,580,700);
      box(50,800,65);
    pop();
    push();
      fill(60);
      translate(0,190,700);
      box(170,20,300);
    pop();
  pop();
}
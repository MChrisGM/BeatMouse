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

  let c = levelScheme;

  for(let div of document.getElementsByClassName('trail')){
    div.style.background = rgbToHex(c['R'][0], c['R'][1], c['R'][2]);
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

function resetStats() {
  combo = 0;
  combos = [0];
  missedNotes = 0;
  hit = 0;
  score = 0;
  intro = true;
  intro_time = 0;
}

function stopMusic(){
  song_audio.stop();
  objectVelocity = 0;
  sp = false;
  canvasState = ENDSCREEN;
}


function displayMap(){
  for (let block of beats) {
    block.move();
    if (!block.hit && !block.missed && cam.centerZ - block.pos.z < 3000 && cam.centerZ - block.pos.z > -2000) {
      block.display();
      block.collision();
      if (block.missed && block.type != 3) {
        combos.push(parseInt(combo));
        combo = 0;
        missedNotes += 1;
        if (noFail) {
          stopMusic();
        }
        continue;
      }
      if (block.missed && block.type == 3) {
        combos.push(parseInt(combo));
        combo = 0;
        if (noFail) {
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
      obstacle.move();
      obstacle.display();
    }
  }
}

function startMap() {
  resetStats();
  setEnvironmentSettings();
  generateNotes();
  windowResized();
  canvasState = GAME;
}
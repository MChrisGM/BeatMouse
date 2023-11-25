const getSong = (song) => new Promise((resolve, reject) => {
  const files = new Map();
  let filesReceived = 0;
  maxFilesLoaded = song.filenames.length - 1;
  filesLoaded = 0;
  for (const file of song.filenames) {
    if (!file.endsWith(".ogg") && !file.endsWith(".egg")) {
      const oReq = new XMLHttpRequest();
      oReq.open("POST", "/get-song");
      oReq.responseType = "blob";
      oReq.addEventListener("load", () => {
        files.set(file, oReq.response);
        filesReceived++;
        filesLoaded++;
        if (filesReceived == maxFilesLoaded) {
          resolve(files);
        }
      });
      oReq.setRequestHeader('song', song.name);
      oReq.setRequestHeader('file', file);
      oReq.send();
    }
  }
});

const getAudio = (song, progressCallback) => new Promise((resolve, reject) => {
  const files = new Map();
  let filesReceived = 0;
  for (const file of song.filenames) {
    if (file.endsWith(".ogg") || file.endsWith(".egg")) {
      const oReq = new XMLHttpRequest();
      oReq.open("POST", "/get-song");
      oReq.responseType = "blob";
      oReq.addEventListener("load", () => {
        files.set(file, oReq.response);
        filesReceived++;
        if (filesReceived == 1) {
          resolve(files);
        }
      });
      oReq.addEventListener('progress', progressCallback);
      oReq.setRequestHeader('song', song.name);
      oReq.setRequestHeader('file', file);
      oReq.send();
    }
  }
});



const getList = () => new Promise((resolve, reject) => {
  var oReq = new XMLHttpRequest();
  oReq.open("POST", "/get-list");
  oReq.addEventListener("load", () => {
    let list = JSON.parse(oReq.response);
    resolve(list);
  });
  oReq.send();
});


const getCustomSong = () => new Promise((resolve, reject) => {
  let formData = new FormData();
  formData.append("file", document.querySelector('[type="file"]').files[0]);

  let request = new XMLHttpRequest();
  request.open("POST", "https://beatmouse-beatmap-converter.herokuapp.com/convert");
  // request.responseType = "JSON";
  request.addEventListener("load", () => {
    if(request.response){
      songFiles = objectToMap(JSON.parse(request.response));
      resolve()
    }
  });
  request.send(formData);
});

let uploading = false;

$(() => {
  $("#file-selector").on('change', async () => {
    await getCustomSong();
    loadSong();
  });
})

async function loadSong(sng) {
	loading = true;
	loaded = false;

	if (sng) {
		let songGettingPromise = getSong(sng);
		songFiles = await songGettingPromise;
	}

	if (songFiles.has('Info.dat')) {
		song_infoDat = JSON.parse(await songFiles.get('Info.dat').text());
	} else if (songFiles.has('info.dat')) {
		song_infoDat = JSON.parse(await songFiles.get('info.dat').text());
	}

	song_cover = songFiles.get(song_infoDat['_coverImageFilename']);
	song_cover = await loadImage(URL.createObjectURL(song_cover));

	difficulties = [];
	beatmap = null;
	selected_difficulty = options['song_Difficulty'] || null;
	let beatMapSets = song_infoDat['_difficultyBeatmapSets'];
	for (let mapset of beatMapSets) {
		if (mapset['_beatmapCharacteristicName'] == 'OneSaber') {
			for (let diffs of mapset['_difficultyBeatmaps']) {
				let flnm = diffs['_beatmapFilename'];
				let diffName = diffs['_difficulty'];
				difficulties.push(
					new clickText(
						createVector(),
						createVector(),
						50,
						diffName,
						async function() {
							selected_difficulty = this.txt;
							beatmap = JSON.parse(await songFiles.get(flnm).text());
							options['song_Difficulty'] = selected_difficulty;
							saveOptions();
						},
						false
					)
				);
				if (diffName == selected_difficulty) {
					beatmap = JSON.parse(await songFiles.get(flnm).text());
				}
			}
		}
	}

	bpm = song_infoDat['_beatsPerMinute'];

	loading = false;
	loaded = true;
}

async function loadAudio(sng) {
	downloadingSong = true;

	if (sng) {
		song_audio = (await getAudio(sng)).get(song_infoDat['_songFilename']);
	} else {
		song_audio = await songFiles.get(song_infoDat['_songFilename']);
	}
  try{
    song_audio = new Sound(URL.createObjectURL(song_audio));
  }catch(E){
    downloadingSong = false;
    throw E;
  }

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

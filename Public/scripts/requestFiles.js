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
        if (filesReceived == song.filenames.length - 1) {
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


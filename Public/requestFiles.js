const getSong = (song) => new Promise((resolve, reject) => {
  const files = new Map();
  let filesReceived = 0;
  for (const file of song.filenames) {
    const oReq = new XMLHttpRequest();
    oReq.open("POST", "/get-song");
    oReq.responseType = "blob";
    oReq.addEventListener("load", () => {
      files.set(file, oReq.response);
      filesReceived++;
      if (filesReceived == song.filenames.length) {
        resolve(files);
      }
    });
    oReq.setRequestHeader('song', song.name);
    oReq.setRequestHeader('file', file);
    oReq.send();
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
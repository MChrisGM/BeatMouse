var express = require('express');
const mega = require('megajs');
const mime = require('mime');
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Started server at https://' + host + ':' + port);
}

app.use(express.static('Public'));

const cached = new Map /* string fileName, File file */ ();
const files = [];

getFiles();

/* =========
  API Routes
========= */

app.post('/get-song', (req, res) => {
  const songDirName = req.headers['song'];
  const fileName = req.headers['file'];

  // if (err) {
  //   console.error('uwu pwez handwe mew');
  //   res.statusCode = 500;
  //   res.send('Yeah frick... Maybwe my dev will handwe mew wone day ;-; uwu');
  // }

  const songDir = cached.get(songDirName);
  for (const file of songDir) {
    if (file.name == fileName) {
      const fileStream = file.download();
      res.setHeader('Content-Type',
        mime.getType(fileName) || 'text/plain');
      fileStream.pipe(res);
      return;
    }
  }

  console.error('uwu fiwle nyot fwound ;-;');
  res.statusCode = 404;
  res.send('Not Found');
  

});

app.post('/get-list', (req, res) => {
  res.send(JSON.stringify(files));
  return;
});




async function getFiles() {
  const url = "https://mega.nz/folder/Dl4XSKIC#v6LWGlvfQ_h_laF3GuLHvQ";
  const dir = mega.file(url);

  dir.loadAttributes(async function(error, songs){
    for (const song of songs.children) {
      let fileObjects = [];
      let filenames = [];
      let _info;
      let diffs=[];
      for (const file of song.children) {
        fileObjects.push(file);
        filenames.push(file.name);
        // if(file.name == "Info.dat" || file.name == "info.dat"){

        //   await file.download(async function(err, data){
        //     if (err) throw err;
        //     let dataJSON = JSON.parse(data.toString());
        //     for (const i of dataJSON['_difficultyBeatmapSets']){
        //       if(i['_beatmapCharacteristicName']=='OneSaber'){
        //         for (const j of i['_difficultyBeatmaps']){
        //           diffs.push(j['_difficulty']);
        //         }
        //       }
        //     }
        //     _info = {
        //       _songName: dataJSON['_songName'],
        //       _songAuthorName: dataJSON['_songAuthorName'],
        //       _bpm: dataJSON['_songAuthorName'],
        //       _difficulties:diffs
        //     };
        //   });
        // }
      }
      const f = {
        name: song.name,
        filenames: filenames,
        // info:_info
      }
      console.log(f);
      files.push(f);
      cached.set(song.name, fileObjects);
    }
  });
}
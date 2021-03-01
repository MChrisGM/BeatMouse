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




function getFiles() {
  const url = "https://mega.nz/folder/Dl4XSKIC#v6LWGlvfQ_h_laF3GuLHvQ";
  const dir = mega.file(url);

  dir.loadAttributes((error, songs) => {
    for (const song of songs.children) {
      let fileObjects = [];
      let filenames = [];
      for (const songFile of song.children) {
        fileObjects.push(songFile);
        filenames.push(songFile.name);
      }
      const f = {
        name: song.name,
        filenames: filenames
      }
      files.push(f);
      cached.set(song.name, fileObjects);
    }
  });
}
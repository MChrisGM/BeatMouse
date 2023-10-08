require("dotenv").config();
var express = require('express');
const { Readable } = require('stream');

require('isomorphic-fetch');
const { Dropbox } = require('dropbox'); 
const dbx = new Dropbox({ 
  clientId: process.env.DBX_KEY,
  clientSecret: process.env.DBX_SECRET,
  refreshToken: process.env.DBX_REFRESH
});

const mime = require('mime');
const DiscordOauth2 = require("discord-oauth2");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

async function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Started server at https://' + host + ':' + port);
  await getFiles();
}

app.use(express.static('Public'));

const cached = new Map /* string fileName, File file */();
const files = [];
const audiofiles = [];

const oauth = new DiscordOauth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

/* =========
  API Routes
========= */

app.post('/get-song', async (req, res) => {
  const songDirName = req.headers['song'];
  const fileName = req.headers['file'];
  const songDir = cached.get(songDirName);
  for (const file of songDir) {
    if (file.endsWith(fileName)) {
      
      dbx.filesDownload({path: file})
      .then(function(response) {

        const readStream = new Readable();
        readStream.push(response['result'].fileBinary, 'binary');
        readStream.push(null);
        res.setHeader('Content-Type', mime.getType(fileName) || 'text/plain');
        readStream.pipe(res);

      })
      .catch((err) => {
        throw err;
      });
      
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

app.get("/discord", asyncHandler(async (req, res, next) => {
  if (!req.query.code) return res.send(content.index);
  let result = undefined;
  try {
    result = await oauth.tokenRequest({
      code: req.query.code,
      grantType: "authorization_code",
      scope: ["identify"]
    });
  } catch {
    return next(new Error("The access code seems to be incorrect."));
  }

  let user = undefined;
  try {
    user = await oauth.getUser(result.access_token);
  } catch (err) {
    console.error(err.stack);
    return next(
      new Error(
        `The server was unable to retrieve the user info from Discord.`
      )
    );
  }

  console.log(`User: ${user.username}#${user.discriminator} has logged in.`);

  const token = jwt.sign({
    USER_NAME: user.username,
    USER_DISC: user.discriminator,
    USER_ID: user.id
  }, process.env.JWTPASS);

  let jsonResponse = JSON.stringify({
    USER_NAME: user.username,
    USER_DISC: user.discriminator,
    USER_ID: user.id,
    USER_AVATAR: user.avatar,
    TOKEN: token
  });

  const sanitiseQuotes = (str) => { return str.replace(/\'/g, '\\\'') }

  const response =
    `
    <script>
        localStorage.setItem('userData','`+ sanitiseQuotes(jsonResponse) + `')
        window.location.href = '/' // sends the user back to the home page
    </script>
    `;
  res.setHeader('Content-Type', 'text/html')
  return res.end(response);
})
);

async function getFiles() {

  dbx.filesListFolder({path: ''})
  .then(function(response) {
    let songs = response['result'].entries;
    for (const song of songs) {
      let fileObjects = [];
      let filenames = [];
      let _info;
      let diffs = [];
      dbx.filesListFolder({path: song['path_display']})
      .then(function(response){
        for (const file of response['result'].entries) {
          fileObjects.push(file['path_display']);
          filenames.push(file['name']);
        }
        const f = {
          name: song.name,
          filenames: filenames
        }
        
        console.log(f);
        files.push(f);
        cached.set(song.name, fileObjects);
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  })
  .catch(function(error) {
    console.log(error);
  });
  
}
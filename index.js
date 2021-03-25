require("dotenv").config();
var express = require('express');
const mega = require('megajs');
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

// async function getAudio() {
//   for (const [key, files] of cached.entries()) {
//     let audio;
//     for (const file of files) {
//       file.loadAttributes(async (error, file) => {
//         if (file.name == "info.dat" || file.name == "Info.dat") {
//           await file.download((err, data) => {
//             if (err) throw err
//             audio = JSON.parse(data.toString())['_songFilename'];
//             audiofiles.push(
//               {
//                 name: key,
//                 audiofile: audio
//               }
//             );
//           });
//         }
//       });
//     }
//   }
// }


async function getFiles() {
  const url = "https://mega.nz/folder/Dl4XSKIC#v6LWGlvfQ_h_laF3GuLHvQ";
  const dir = mega.file(url);

  dir.loadAttributes(async function(error, songs) {
    for (const song of songs.children) {
      let fileObjects = [];
      let filenames = [];
      let _info;
      let diffs = [];
      for (const file of song.children) {
        fileObjects.push(file);
        filenames.push(file.name);

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
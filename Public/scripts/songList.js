function displaySongs() {
  if (songs) {
    let songDisplay = [];
    let idx = parseInt(Math.floor(scrollIdx));
    if (idx < 0) { idx = 0; }

    let filteredSongs = JSON.parse(JSON.stringify(songs));

    let filteredResult = [];
    let toRemove = [];

    if (searchText != "") {
      let songNames = songs.map(function (task, index, array) {
        return task.name; 
      });
      const options = {
        includeScore: true
      }
      const fuse = new Fuse(songNames, options)
      const result = fuse.search(searchText)
      
      filteredResult = result.map(function (task, index, array) {
        return task["item"];
      });
    }

    if (filteredResult.length > 0) {
      filteredSongs = [];
      for(let songName of filteredResult){
        filteredSongs.push(songs.find(item => item.name === songName));
      }
    }

    for (let i = idx; i < idx + 5; i++) {
      if (filteredSongs[i]) {
        let name = "";
        if (filteredSongs[i].name.length > 15) {
          name = filteredSongs[i].name.substring(0, 15) + "...";
        } else {
          name = filteredSongs[i].name;
        }
        songDisplay.push(
          new clickText(null, null, 60, name.replaceAll("_", " "), async function() {
            if (!loading) {
              selected_Song = filteredSongs[i];
              options['song_Name'] = selected_Song['name'];
              saveOptions();
              await loadSong(selected_Song);
            }
          }, false)
        );
      }
    }
    if (songDisplay.length < 5) {
      songDisplay.push(
        new clickText(null, null, 60, "Custom Song", async function() {
          if (!loading && !uploading) {
            uploading = true;
            $("#file-selector").trigger("click");
            uploading = false;
          }
        }, false)
      );
    }
    return songDisplay;
  }
}





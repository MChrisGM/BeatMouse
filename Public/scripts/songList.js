function displaySongs() {
  if (songs) {
    let songDisplay = [];
    for (let i = scrollIdx; i < scrollIdx+5; i++) {
      if (songs[i]) {
        songDisplay.push(
          new clickText(createVector(), createVector(), 60, songs[i].name.replaceAll("_"," "), async function() {
            if(!loading){
              selected_Song = songs[i];
              options['song_Name'] = selected_Song['name'];
              saveOptions();
              await loadSong(selected_Song);
            }
          })
        );
      }
    }
    return songDisplay;
  }
}
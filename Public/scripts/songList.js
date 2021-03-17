function displaySongs() {
  if (songs) {
    let songDisplay = [];
    let idx = parseInt(Math.floor(scrollIdx));
    if(idx<0){idx=0;}
    for (let i = idx; i < idx+5; i++) {
      if (songs[i]) {
        let name = "";
        if(songs[i].name.length > 15){
          name = songs[i].name.substring(0, 15)+"...";
        }else{
          name = songs[i].name;
        }
        songDisplay.push(
          new clickText(null, null, 60, name.replaceAll("_"," "), async function() {
            if(!loading){
              selected_Song = songs[i];
              options['song_Name'] = selected_Song['name'];
              saveOptions();
              await loadSong(selected_Song);
            }
          },false)
        );
      }
    }
    return songDisplay;
  }
}
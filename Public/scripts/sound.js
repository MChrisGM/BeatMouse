// Gets a sound file and stores it into memory so we can reuse it.
// In other words, we don't have to retreive this file multiple times.

const getSoundFile = (filename, progressCallback) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.responseType = 'blob';
    req.open('GET', filename);

    req.addEventListener('load', () => {
      resolve(URL.createObjectURL(req.response));
    });

    req.addEventListener('progress', progressCallback);
    req.addEventListener('error', reject);

    req.send();
  });
}

class Sound {
  audio; // HTMLAudioElement
  active = false; // Boolean
  endCallback; // Function

  constructor(fileURL) {
    this.audio = document.createElement('audio');
    this.audio.pause();
    this.audio.src = fileURL;

    this.audio.onended = () => {
      if (this.endCallback) this.endCallback();
      this.destruct();
    }
  }

  destruct() {
    this.audio.remove();
  }

  waitUntilLoaded() {
    return new Promise(resolve => {
      if (this.audio.duration > 0) {
        resolve();
        return;
      }

      this.audio.oncanplay = resolve;
    });
  }

  play() {
    this.active = true;
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  time() {
    return this.audio.currentTime;
  }

  duration() {
    return this.audio.duration;
  }

  setVolume(newVolume) {
    this.audio.volume = newVolume;
  }

  seek(seconds) {
    this.audio.currentTime = seconds;
  }

  stop() {
    this.pause();
    this.seek(0);
    this.active = false;
  }

  isPlaying() {
    return !this.audio.paused;
  }

  isPaused() {
    return !this.active;
  }

  onended(callback) {
    this.endCallback = callback;
  }
};
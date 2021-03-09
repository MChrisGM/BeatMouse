let version = 2;
let canvas;
let cam;

const MENU = 'menu';
const GAME = 'game';

let canvasState = MENU;

const default_options = {
  app_version: version,
  song_Name: '',
  song_Difficulty: '',
  song_Volume: {mode:'slider',value:50,min:0,max:100,},
  slice_Volume: {mode:'slider',value:50,min:0,max:100,},
  render_options: {
    indicators: {mode: 'switch',value: false},
    obstacles: {mode: 'switch',value: true},
    mouse_trail: { mode: 'switch',value: true},
  },
  game_options: {
    no_fail: { mode: 'switch', value: true },
    instant_fail: { mode: 'switch', value: false },
  },
}

let options;

let songs;
let songFiles;
let song_infoDat;
let song_audio;
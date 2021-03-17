let version = 2;
let canvas;
let cam;

let stp = false;
let prld = false;

const MENU = 'menu';
const GAME = 'game';
const LOADING = 'loading';

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

let scrollIdx = 0;

let songs;
let songFiles;
let song_infoDat;
let song_audio;
let song_cover;

let loading = false;
let loaded = false;

let strt = false;

let tiltRotation = 0;
let panRotation = 0;

let difficulties;
let selected_difficulty;
let beatmap;
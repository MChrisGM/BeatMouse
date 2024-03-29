let version = 3.1;
let canvas;
let cam;

let stp = false;
let prld = false;

const MENU = 'menu';
const GAME = 'game';
const LOADING = 'loading';
const ENDSCREEN = 'endscreen';

let canvasState = MENU;

const default_options = {
  app_version: version,
  song_Name: 'Lone_Digger',
  song_Difficulty: '',
  song_Volume: {mode:'slider',value:20,min:0,max:100,},
  slice_Volume: {mode:'slider',value:10,min:0,max:100,},
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
let filesLoaded;
let maxFilesLoaded;

let strt = false;
let paused = false;
let tiltRotation = 0;
let panRotation = 0;

let difficulties;
let selected_difficulty;
let selected_Song;
let downloadingSong = false;
let beatmap;

let indexs = [-90, -30, 30, 90];
let layers = [55, 5, -45];

let song_volume = 100;
let beatLength;
let songDuration;
let sliceFile;

let fpsCounter;

let loggedIn = false;

let loginURL = 'https://discord.com/api/oauth2/authorize?client_id=821927162465484810&redirect_uri=https%3A%2F%2Fbeatmouse.mchrisgm.repl.co%2Fdiscord&response_type=code&scope=identify';

let beats;
let obstacles;

let objectVelocity;
let bpm;
let hitIndicator = true;
let hitvolume = 70;
let hitboxOffset = 20;
let sp = false;
let displayObstacles = true;
let combos = [0];
let missedNotes = 0;
let combo = 0;
let noFail = false;
let score = 0;
let hit;
let noteCount;
let comboMulti = 0;

let enableTrail = true;

let intro;
let intro_time;

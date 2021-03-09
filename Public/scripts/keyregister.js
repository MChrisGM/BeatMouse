const keysDown = {};

addEventListener('keydown', e => {
	keysDown[e.code] = true;
});

addEventListener('keyup', e => {
	keysDown[e.code] = false;
});

const keycodeIsDown = (code) => {
  return keysDown[code];
}
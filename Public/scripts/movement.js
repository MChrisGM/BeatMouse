function player_movement() {
  if (keycodeIsDown('ShiftLeft')) { //Shift
    if (cam.eyeY < 50) {
      cam.setPosition(cam.eyeX, cam.eyeY + 5, cam.eyeZ);
    }
  } else {
    if (cam.eyeY > 5) {
      cam.setPosition(cam.eyeX, cam.eyeY - 5, cam.eyeZ);
    }
  }
  if (keycodeIsDown('KeyW')) { //W
    if (tiltRotation > -0.4) {
      cam.tilt(-0.02);
      tiltRotation -= 0.02;
    }
  } else if (keycodeIsDown('KeyS')) { //S
    if (tiltRotation < 0.4) {
      cam.tilt(0.02);
      tiltRotation += 0.02;
    }
  } else {
    if (Math.abs(tiltRotation)<0.05) {
      cam._rotateView(-tiltRotation, 1, 0, 0);
      tiltRotation = 0;
    } else {
      if (tiltRotation > 0.02) {
        cam._rotateView(-0.02, 1, 0, 0);
        tiltRotation -= 0.02;
      } else if (tiltRotation < 0.02) {
        cam._rotateView(0.02, 1, 0, 0);
        tiltRotation += 0.02;
      }
    }
  }
  if (canvasState == GAME) {
    if (keycodeIsDown('KeyA')) { //A
      if (cam.eyeX > -50) {
        cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
      }
    } else if (keycodeIsDown('KeyD')) { //D
      if (cam.eyeX < 50) {
        cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
      }
    } else if (keycodeIsDown('KeyE')) { //E
      if (cam.eyeX < 25) {
        cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
      }
    } else if (keycodeIsDown('KeyQ')) { //Q
      if (cam.eyeX > -25) {
        cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
      }
    } else {
      if (cam.eyeX > 5) {
        cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
      }
      if (cam.eyeX < -5) {
        cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
      }
    }
  } else if (canvasState == MENU) {
    if (keycodeIsDown('KeyQ')) { //Q
      if(panRotation<1){
        panRotation+=0.02;
        cam.pan(0.02);
      }
    } else if (keycodeIsDown('KeyE')) { //E
      if(panRotation>-1){
        panRotation-=0.02;
        cam.pan(-0.02);
      }
    }
    if (keycodeIsDown('KeyA')) { //A
      if (cam.eyeX > -50) {
        cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
      }
    } else if (keycodeIsDown('KeyD')) { //D
      if (cam.eyeX < 50) {
        cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
      }
    } else {
      if (cam.eyeX > 5) {
        cam.setPosition(cam.eyeX - 5, cam.eyeY, cam.eyeZ);
      }
      if (cam.eyeX < -5) {
        cam.setPosition(cam.eyeX + 5, cam.eyeY, cam.eyeZ);
      }
    }
  }
}
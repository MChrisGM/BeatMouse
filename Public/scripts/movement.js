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
  }else if(canvasState == MENU){
    if (keycodeIsDown('KeyQ')) { //Q
      cam.pan(0.02);
    } else if (keycodeIsDown('KeyE')) { //E
      cam.pan(-0.02);
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
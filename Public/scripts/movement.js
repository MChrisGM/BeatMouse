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
    if (keycodeIsDown('KeyA')) { //A
      console.log(cam.centerX,cam.centerZ);
      cam.pan(0.01);
      if (cam.eyeX > -50) {
        
      }
    } else if (keycodeIsDown('KeyD')) { //D
      if (cam.eyeX < 50) {
        
      }
    } else if (keycodeIsDown('KeyE')) { //E
      if (cam.eyeX < 25) {
        
      }
    } else if (keycodeIsDown('KeyQ')) { //Q
      if (cam.eyeX > -25) {
        
      }
    } else {
      if (cam.eyeX > 5) {
        
      }
      if (cam.eyeX < -5) {
        
      }
    }

  }
}
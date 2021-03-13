function logo(){
  push();
  translate(0, -800 + 180 / 3, -400);
  rotateX(-0.25);
  fill(255, 0, 0);
  textFont(neonFont);
  textSize(180);
  textStyle(BOLD);
  textAlign(CENTER)
  shininess(1);
  text("Beat", 0, 0);
  pop();

  push();
  translate(0, -600 + 180 / 3, -400);
  rotateX(-0.3);
  fill(0, 0, 255);
  textFont(neonFont);
  textSize(180);
  textStyle(BOLD);
  textAlign(CENTER)
  shininess(1);
  text("Mouse", 0, 0);
  pop();
}

function settings(p,r){
  //Settings menu
  push();
  translate(p.x,p.y,p.z);
  rotateY(r.y);
  rotateX(r.x);
  rotateZ(r.z);
  fill(255, 255, 255, 200);
  plane(750, 550, 2, 2)
  pop();
  new clickText(createVector(p.x,p.y-200,p.z),createVector(r.x,r.y,r.z), 100, "Settings");
}

function leaderboard(p,r){
  //Leaderboard menu
  push();
  translate(p.x,p.y,p.z);
  rotateY(r.y);
  rotateX(r.x);
  rotateZ(r.z);
  fill(255, 255, 255, 200);
  plane(750, 550, 2, 2)
  pop();
  new clickText(createVector(p.x,p.y-200,p.z),createVector(r.x,r.y,r.z), 100, "Leaderboard");
}
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
  new clickText(createVector(p.x,p.y-200,p.z),createVector(r.x,r.y,r.z), 100, "Settings").display();
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
  new clickText(createVector(p.x,p.y-200,p.z),createVector(r.x,r.y,r.z), 100, "Leaderboard").display();
}

function mainMenu(p, r) {
  //Main menu
  push();
  translate(p.x, p.y, p.z);
  rotateX(r.x);
  rotateY(r.y);
  rotateZ(r.z);
  fill(255, 255, 255, 200);
  plane(900, 600, 2, 2);
  pop();

  if (!prld && !strt) {
    new clickText(p, r, 300, "Loading...").display();
  } else if(prld && !strt) {
    new clickText(p, r, 300, "Start", function() {
      strt = true;
    }).display();
  }

  if(strt){
    scrollMenu(p,r);
  }
}


function scrollMenu(p,r){
  let lst = displaySongs();

  p.y -= 300;

  let ys = [35,100,200,300,400,500,565];

  let xOffset = 200;

  if(loaded){
    displaySongInfo(p,r);
  }else{
    new clickText(createVector(p.x+200,p.y+ys[3],p.z), r, 100, "Loading...").display();
  }

  p.x-=xOffset;

  new clickText(createVector(p.x,p.y+ys[0],p.z), r, 80, "^", function() {
      if(scrollIdx>0){
        scrollIdx-=1;
      }
  }).display();

  for (let i = 0;i<lst.length;i++){
    lst[i].pos = createVector(p.x,p.y,p.z);
    lst[i].pos.y += ys[i+1];
    lst[i].rot = r;
    lst[i].calcB();
    lst[i].display();
  }
  new clickText(createVector(p.x,p.y+ys[6],p.z), r, 80, "v", function() {
      if(scrollIdx<songs.length-2){
        scrollIdx+=1;
      }
  }).display();
}

function displaySongInfo(p,r){

  

}
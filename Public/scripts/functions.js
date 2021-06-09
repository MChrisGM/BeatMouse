/* unlicense.org */

/* Multiply a 4x4 homogeneous matrix by a Vector4 considered as point
 * (ie, subject to translation). */
function multMatrixVector(m, v) {
  if (!(m instanceof p5.Matrix) || !(v instanceof p5.Vector)) {
    print('multMatrixVector : Invalid arguments');
    return;
  }

  var _dest = createVector();
  var mat = m.mat4;

  // Multiply in column major order.
  _dest.x = mat[0] * v.x + mat[4] * v.y + mat[8] * v.z + mat[12];
  _dest.y = mat[1] * v.x + mat[5] * v.y + mat[9] * v.z + mat[13];
  _dest.z = mat[2] * v.x + mat[6] * v.y + mat[10] * v.z + mat[14];
  var w = mat[3] * v.x + mat[7] * v.y + mat[11] * v.z + mat[15];

  if (Math.abs(w) > Number.EPSILON) {
    _dest.mult(1.0 / w);
  }

  return _dest;
}

/* Project a vector from Canvas to World coordinates. */
function projectCanvasToWorld(canvas, vCanvas) {
  // Retrieve the ModelView and Projection matrices.
  var mv = canvas.uMVMatrix.copy();
  var p = canvas.uPMatrix.copy();

  // Compute the ModelViewProjection matrix.
  var mvp = mv.mult(p);

  // Inverts the MVP.
  var invMVP = mvp.invert(mvp);

  // Transform the canvas vector to Normalized Device Coordinates (in [-1, 1]³),
  // Here viewport is (0, 0, drawingBufferWidth, drawingBufferHeight).
  var vNDC = createVector();
  vNDC.x = (-1.0 + 2.0 * (vCanvas.x / canvas.GL.drawingBufferWidth));
  vNDC.y = (-1.0 + 2.0 * (vCanvas.y / canvas.GL.drawingBufferHeight));
  vNDC.z = (-1.0 + 2.0 * (vCanvas.z));

  // Transform vector from NDC to world coordinates.
  var vWorld = multMatrixVector(invMVP, vNDC);

  return vWorld;
}

/* Project a vector from World to Canvas coordinates. */
function projectWorldToCanvas(canvas, vWorld) {
  // Calculate the ModelViewProjection Matrix.
  var mvp = (canvas.uMVMatrix.copy()).mult(canvas.uPMatrix);

  // Transform the vector to Normalized Device Coordinate.
  var vNDC = multMatrixVector(mvp, vWorld);

  // Transform vector from NDC to Canvas coordinates.
  var vCanvas = createVector();
  vCanvas.x = 0.5 * (vNDC.x + 1.0) * canvas.GL.drawingBufferWidth;
  vCanvas.y = 0.5 * (vNDC.y + 1.0) * canvas.GL.drawingBufferHeight;
  vCanvas.z = 0.5 * (vNDC.z + 1.0);

  return vCanvas;
}

function format(time) {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

let navOpen = false;

function openNav() {
  navOpen = true;
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("volumeSlider").style.display = "block";
  document.getElementById("hitvolumeSlider").style.display = "block";
  // document.getElementById("usernameWelcome").style.display = "block";
  
}

function closeNav() {
  navOpen = false;
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("volumeSlider").style.display = "none";
  document.getElementById("hitvolumeSlider").style.display = "none";
  // document.getElementById("usernameWelcome").style.display = "none";
  
}

function songDropdown() {
  document.getElementById("songDropdown").classList.toggle("show");
}

function levelDropdown() {
  document.getElementById("levelDropdown").classList.toggle("show");
}

// document.addEventListener("click", function(evt) {
//   if (navOpen) {
//     console.log('Opened');
//     var flyoutElement = document.getElementById('mySidenav'),
//       targetElement = evt.target;  // clicked element

//     do {
//       if (targetElement == flyoutElement) {
//         return;
//       }
//       // Go up the DOM
//       targetElement = targetElement.parentNode;
//     } while (targetElement);

//     // This is a click outside.
//     // console.log(document.getElementById("mySidenav").style.width);
//     // if(document.getElementById("mySidenav").style.width == '250px' ){closeNav();}
    
//   }

// });

var dots = [],
    mouse = {
      x: 0,
      y: 0
    };

// The Dot object used to scaffold the dots
var Dot = function() {
  this.x = 0;
  this.y = 0;
  this.node = (function(){
    var n = document.createElement("div");
    n.className = "trail";
    document.body.appendChild(n);
    return n;
  }());
};
// The Dot.prototype.draw() method sets the position of 
  // the object's <div> node
Dot.prototype.draw = function() {
  this.node.style.left = this.x + "px";
  this.node.style.top = this.y + "px";
};

// Creates the Dot objects, populates the dots array
for (var i = 0; i < 40; i++) {
  var d = new Dot();
  dots.push(d);
}

// This is the screen redraw function
function drawTrail() {
  // Make sure the mouse position is set everytime
    // draw() is called.
  var x = mouse.x,
      y = mouse.y;
  
  // This loop is where all the 90s magic happens
  dots.forEach(function(dot, index, dots) {
    var nextDot = dots[index + 1] || dots[0];
    
    dot.x = x-4;
    dot.y = y-4;
    dot.draw();
    x += (nextDot.x - dot.x) * 0.1;
    y += (nextDot.y - dot.y) * 0.1;

    dot.node.style.display = 'block';
    dot.node.style.opacity = (1/(index/40))*15+"%";

  });
}

function hideTrail(){
  dots.forEach(function(dot, index, dots) {
    dot.node.style.display = 'none';
  });
}

addEventListener("mousemove", function(event) {
  //event.preventDefault();
  mouse.x = event.pageX;
  mouse.y = event.pageY;
});

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function assign(variable,value){
    eval(Object.keys(variable)[0]+"="+value);
}

const objectToMap = obj => {
   const keys = Object.keys(obj);
   const map = new Map();
   for(let i = 0; i < keys.length; i++){
      // map.set(keys[i], new Blob([obj[keys[i]]], {type: 'text/plain'}));
      map.set(keys[i], obj[keys[i]]);
   };
   return map;
};
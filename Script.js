//Board Klasse importieren
function include(file){
  var script = document.createElement("script");
  script.scr = file;
  script.type = "text/javascript";
  script.defer = true;
  document.body.appendChild(script);
}
include("./Board.js");
//Globale Variablen erzeugen
var leinwand;
var context;
var div;
var offset = 30;
var canvasSize = Math.max(Math.min(window.innerWidth, window.innerHeight) - offset, 1);
var tileSize = canvasSize/8;
var mouseX;
var mouseY;
var rect;       //Rectangle of Canvas

//initializing board
var board = new Board();


//Eventlistener
window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", click);

//Canvas erstellen
function addCanvas(){
  //Canvas einfügen
  leinwand = document.createElement("canvas");
  leinwand.id = "canvas";
  context = leinwand.getContext("2d");
  leinwand.width = canvasSize;
  leinwand.height = canvasSize;
  div = document.getElementById("div");
  document.body.insertBefore(leinwand, div);
}

//Recalculating resized window
function resizeCanvas(){
  canvasSize = Math.max(Math.min(window.innerWidth, window.innerHeight) - offset, 1);
  leinwand.width = canvasSize;
  leinwand.height = canvasSize;
  tileSize = canvasSize/8;
  board.draw(context, tileSize);
}

//Das passiert bei einem Mausklick
function click(){
  rect = leinwand.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  tileX = Math.floor(mouseX/tileSize);
  tileY = Math.floor(mouseY/tileSize);

  if(tileX>=0&&tileX<=7&&tileY>=0&&tileY<=7){
    board.tileClicked(context, tileSize, tileX, tileY);
  }
}

function execute(){
  addCanvas();
  //Draw board when the whole site is loaded
  window.addEventListener('load', function(){
    board.draw(context, tileSize);
  })
}

//Executing Program - initializing Canvas - drawing Board
execute();

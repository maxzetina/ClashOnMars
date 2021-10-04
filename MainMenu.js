let backImg,
  backgroundMusic,
  inconsolata,
  buttonMulti,
  buttonSingle,
  buttonSound;

function preload() {
  backgroundMusic = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Fmainmenu.mp3?v=1628096373327"
  );
  buttonSound = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Fbuttonclick.mp3?v=1628099706138"
  );
  inconsolata = loadFont(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FInconsolata-Black.otf?v=1628091631928"
  );
  backImg = loadImage(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Frrrrpixfire_1x1_shop_preview.jpg?v=1628091844434"
  );
}

function setup() {
  createCanvas(400, 400, WEBGL);
  backgroundMusic.play();
  backgroundMusic.loop();
  backgroundMusic.setVolume(0.1);

  colorMode(HSB, 360, 100, 100);

  // creates the multiplayer button
  buttonMulti = createButton("MULTIPLAYER");
  buttonMulti.position((4.75 * width) / 8, 0.75 * height);
  buttonMulti.mousePressed(multiplayer);

  // creates the singleplayer button
  buttonSingle = createButton("SINGLEPLAYER");
  buttonSingle.position((1.5 * width) / 8, 0.75 * height);
  buttonSingle.mousePressed(singleplayer);

  textAlign(CENTER);
  textSize(40);
  textFont(inconsolata);
}

function draw() {
  push();
  translate(0, 0, -1000);
  image(backImg, -1000, -1000, 2000, 2000);
  translate(0, 0, 1000);

  fill("white");
  stroke(0);
  strokeWeight(1000);
  textSize(40);

  let time = millis();
  rotateY(time / 1000);
  text("CLASH ON MARS", 0, 0);
  
  pop();
  
  textSize(20);
  text("Credit: Music by Rare Ltd", 0, height/2-10);
}

// this function is called when the multiplayer button
// is pressed, switches html file and runs multiplayerinstructions.html
// which uses MultiplayerInstructions.js
function multiplayer() {
  buttonSound.play();
  buttonSound.setVolume(0.08);
  setTimeout(function() {
    window.location.replace("./multiplayerinstructions.html");
  }, 400);
}

// this function is called when the singleplayer button
// is pressed, switches html file and runs singleplayerinstructions.html
// which uses SingpleplayerInstructions.js
function singleplayer() {
  buttonSound.play();
  buttonSound.setVolume(0.08);
  setTimeout(function() {
    window.location.replace("./singleplayerinstructions.html");
  }, 400);
}

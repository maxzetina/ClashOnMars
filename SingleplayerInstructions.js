let playSingleplayerButton;
let mainMenu;
let w, a, s, d, r;
let buttonSound;
let buttonSound2;

function preload() {
  buttonSound = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FRealistic%20Gunshot%20Sound%20Effect.mp3?v=1628094830857"
  );
  buttonSound2 = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FKeyboard%20press%20-%20Sound%20Effect.mp3?v=1628181752889"
  );
}

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);

  playSingleplayerButton = createButton("PLAY");
  playSingleplayerButton.size(100, 30);
  playSingleplayerButton.position(width / 2 - 50, 360);
  playSingleplayerButton.mousePressed(playSingleplayer);

  mainMenu = createButton("Main Menu");
  mainMenu.position(10, 410);
  mainMenu.mousePressed(returnToMainMenu);
}

function draw() {
  background(0);

  textAlign(CENTER);
  fill(255);

  push();
  textSize(22);
  stroke(255);
  text("INSTRUCTIONS", width / 2, 30);
  pop();

  push();
  textSize(14);
  text("Welcome to Singleplayer mode!", width / 2, 70);
  text(
    "Destroy as many enemies as you can to increase your score.",
    width / 2,
    100
  );
  text("But be careful--an enemy will be shooting at you.", width / 2, 130);
  text("And you only have 100 health. Good Luck!", width / 2, 160);
  pop();

  push();
  textAlign(LEFT);
  textSize(18);
  fill(185, 100, 85);
  stroke(185, 100, 85);
  strokeWeight(1.5);
  text("HOW TO PLAY:", 5, 200);
  pop();

  push();
  textAlign(LEFT);
  fill(255);
  stroke(255);
  textSize(15);
  text("W - UP", 5, 230);
  text("A - DOWN", 5, 250);
  text("S - LEFT", 5, 270);
  text("D - RIGHT", 5, 290);
  text("R - SHOOT", 5, 310);
  pop();

  // draws squares with WASDR in them to portray keyboard instructions
  push();
  w = new Key("W", width / 2 - 25, 200);
  a = new Key("A", width / 2 - 85, 260);
  s = new Key("S", width / 2 - 25, 260);
  d = new Key("D", width / 2 + 35, 260);
  r = new Key("R", width / 2 + 95, 200);

  w.draw();
  a.draw();
  s.draw();
  d.draw();
  r.draw();
  pop();
}

class Key {
  constructor(keyLetter, x, y) {
    this.keyLetter = keyLetter;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
  }

  draw() {
    push();
    stroke(255);
    strokeWeight(3);
    noFill();
    rect(this.x, this.y, this.width, this.height);
    pop();
    stroke(0, 100, 100);
    fill(0, 100, 100);
    text(this.keyLetter, this.x + this.width / 2, this.y + this.height / 2);
  }
}

function playSingleplayer() {
  buttonSound.play();
  buttonSound.setVolume(0.2);
  setTimeout(function() {
    window.location.replace("./singleplayer.html");
  }, 400);
}

function returnToMainMenu() {
  buttonSound2.play();
  setTimeout(function() {
    window.location.replace("./index.html");
  }, 400);
}

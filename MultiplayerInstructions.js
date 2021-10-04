let playMultiplayerButton;
let mainMenu;
let w, a, s, d, r;
let up, down, left, right, shoot;
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

  playMultiplayerButton = createButton("PLAY");
  playMultiplayerButton.size(100, 30);
  playMultiplayerButton.position(width / 2 - 50, 360);
  playMultiplayerButton.mousePressed(playMultiplayer);

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
  text("Welcome to Multiplayer mode!", width / 2, 70);
  text("Try to destroy your opponent before they destroy you!", width / 2, 100);
  text("You each start with 10 health. Good Luck!", width / 2, 130);
  pop();

  push();
  textAlign(LEFT);
  textSize(18);
  fill(185, 100, 85);
  stroke(185, 100, 85);
  strokeWeight(1.5);
  text("HOW TO PLAY:", 5, 160);
  pop();

  push();
  textAlign(LEFT);
  fill(255);
  stroke(255);
  textSize(15);

  // P1 controls
  push();
  stroke(240, 100, 100);
  fill(240, 100, 100);
  text("PLAYER 1", 50, 190);

  w = new Key(1, "W", 70, 210);
  a = new Key(1, "A", 20, 260);
  s = new Key(1, "S", 70, 260);
  d = new Key(1, "D", 120, 260);
  r = new Key(1, "R", 140, 210);

  w.draw();
  a.draw();
  s.draw();
  d.draw();
  r.draw();
  pop();

  push();
  fill(255);
  stroke(255);
  textSize(11);
  text("W  -  UP", 20, 315);
  text("A  -  DOWN", 20, 334);
  text("S  -  LEFT", 20, 355);
  text("D  -  RIGHT", 20, 375);
  text("R  -  SHOOT", 20, 395);
  pop();

  // P2 controls
  push();
  stroke(120, 100, 100);
  fill(120, 100, 100);
  text("PLAYER 2", 270, 190);

  up = new Key(2, "^", 290, 210);
  left = new Key(2, "<", 240, 260);
  down = new Key(2, "v", 290, 260);
  right = new Key(2, ">", 340, 260);
  shoot = new Key(2, "?", 220, 210);

  up.draw();
  left.draw();
  down.draw();
  right.draw();
  shoot.draw();
  pop();

  push();
  fill(255);
  stroke(255);
  textSize(11);
  text("^  -  UP", 290, 315);
  text("v  -  DOWN", 290, 335);
  text("<  -  LEFT", 290, 355);
  text(">  -  RIGHT", 290, 375);
  text("?  -  SHOOT", 290, 395);
  pop();

  pop();
}

class Key {
  constructor(playerNum, keyLetter, x, y) {
    this.keyLetter = keyLetter;
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    if (playerNum == 1) {
      this.color = color(240, 100, 100);
    } else if (playerNum == 2) {
      this.color = color(120, 100, 100);
    }
  }

  draw() {
    push();
    stroke(255);
    strokeWeight(3);
    noFill();
    rect(this.x, this.y, this.width, this.height);
    pop();
    stroke(this.color);
    fill(this.color);
    text(this.keyLetter, this.x + this.width / 2, this.y + this.height / 2);
  }
}

function playMultiplayer() {
  buttonSound.play();
  buttonSound.setVolume(0.2);
  setTimeout(function() {
    window.location.replace("./multiplayer.html");
  }, 400);
}

function returnToMainMenu() {
  buttonSound2.play();
  setTimeout(function() {
    window.location.replace("./index.html");
  }, 400);
}
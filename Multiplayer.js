let playerOne,
  playerTwo,
  platformOne,
  platformTwo,
  platformThree,
  img,
  bullet,
  mainMenu,
  pauseButton,
  backImg,
  bulletSound,
  backgroundMusic,
  buttonSound;

function preload(){
  backgroundMusic = loadSound('https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FHS%20Final%20Boss%20Music%20(Sea%20Of%20Thieves%20Soundtrack).mp3?v=1628097806143')
  soundFormats('mp3');
  bulletSound = loadSound('https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FRealistic%20Gunshot%20Sound%20Effect.mp3?v=1628094830857');
  bulletSound.setVolume(.1)
  buttonSound = loadSound('https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FKeyboard%20press%20-%20Sound%20Effect.mp3?v=1628181752889');
}

function setup(){
  // Canvas & color settings
  createCanvas(400, 400);
  backgroundMusic.play()
  backgroundMusic.loop()
  backgroundMusic.setVolume(.05)
  colorMode(HSB, 360, 100, 100);
  
  img = loadImage(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Fredplatform.png?v=1627668770121"
  );
  
  backImg = loadImage("https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Flavabackground.png?v=1628091759977")

  // two Player object, starting at opposite corners of screen
  playerOne = new Player(1, width / 4 + 20, 20);
  playerTwo = new Player(2, (3 * width) / 4 + 20, 20);

  platformOne = new Platform(1, width / 2, height / 2, width / 5, height / 30);
  platformTwo = new Platform(
    2,
    (3 * width) / 4,
    (3 * height) / 4,
    width / 5,
    height / 30
  );
  platformThree = new Platform(
    3,
    width / 4,
    (3 * height) / 4,
    width / 5,
    height / 30
  );

  // creates a Main Menu button at the bottom
  // of the screen, could be repositioned.
  // When pressed, calls returnToMainMenu()
  mainMenu = createButton("Main Menu")
  mainMenu.position(10, 410)
  mainMenu.mousePressed(returnToMainMenu)
  
  pauseButton = createButton("Pause")
  pauseButton.position(200, 410)
  pauseButton.mousePressed(pause)
}

// goes back to using index.html which runs 
// the MainMenu.js
function returnToMainMenu(){
  buttonSound.play()
  setTimeout(function(){
    window.location.replace("./index.html");
  }, 400)
  
}

function draw(){
  background(backImg);

  //middle platform
  platformOne.main();

  //platform on the right
  platformTwo.main();

  //platform on the left
  platformThree.main();

  playerOne.main();
  playerOne.takeDamage(playerTwo);
  
  playerTwo.main();
  playerTwo.takeDamage(playerOne);

  displayHealth();
}

class Platform {
  constructor(platformNum, x, y, platformWidth, platformHeight) {
    this.platformNum = platformNum;
    this.x = x;
    this.y = y;
    this.width = platformWidth;
    this.height = platformHeight;
    this.speed = 1;
  }
  
  main() {
    this.draw()
    this.move()
  }

  draw() {
    push();
    rect(this.x, this.y, this.width, this.height);
    image(img, this.x, this.y, this.width, this.height);
    pop();
  }

  move() {
    this.x += this.speed;
    if (this.x >= width - this.width || this.x <= 0) {
      this.speed *= -1;
    }
  }
}

function displayHealth() {
  push();

  let healthBarH = 10

  fill(50)
  rect(10, 20, 100, healthBarH)
  rect(290, 20, 100, healthBarH)
  
  fill(playerOne.color)
  rect(10, 20, playerOne.health*10, healthBarH)
  fill(playerTwo.color)

  rect(290, 20, playerTwo.health*10, healthBarH)
  // added this if statement to check for 0 health (i.e game over) and change to gameover screen
  // if game is over, call gameover(winner) which takes the winner player as a parameter
  if (playerOne.health <= 0) {
    gameOver(playerTwo);
  } else if (playerTwo.health <= 0) {
    gameOver(playerOne);
  }

  pop();
}

class Player {
  constructor(playerNum, x, y) {
    this.playerNum = playerNum;
    this.x = x;
    this.y = y;
    this.size = 20;
    this.direction = "N";
    this.speed = 2;
    this.yvelocity = 0;
    this.jumpHeight = 2;
    this.gravity = 0.1;
    this.bullets = [];
    this.shotCooldown = 15;
    this.shotCounter = 0;
    this.shotOnCooldown = false;
    this.health = 10;

    if (this.playerNum == 1) {
      this.color = color(240, 100, 100);

      this.shootKey = 82;

      this.upKey = 87;
      this.downKey = 83;
      this.rightKey = 68;
      this.leftKey = 65;
    } else if (this.playerNum == 2) {
      this.color = color(120, 100, 100);

      this.shootKey = 191;

      this.upKey = UP_ARROW;
      this.downKey = DOWN_ARROW;
      this.rightKey = RIGHT_ARROW;
      this.leftKey = LEFT_ARROW;
    }
  }
  
  main() {
    this.draw();
    this.move();
    this.shoot();
    this.collisionDetection();
  }

  takeDamage(otherPlayer) {
    for (let i = 0; i < this.bullets.length; i++) {
      if(!this.bullets[i].isActive) {
        continue;
      }
    let hit = collideRectCircle(
      this.bullets[i].x,
      this.bullets[i].y,
      this.bullets[i].width,
      this.bullets[i].height,
      otherPlayer.x,
      otherPlayer.y,
      otherPlayer.size
    );
    if (hit) {
      this.score +=1;
      otherPlayer.health -= 1;
      
      this.bullets[i].isActive = false;
    }
  }
}

  collisionDetection() {
    let hitOne = collideRectCircle(
      platformOne.x,
      platformOne.y,
      platformOne.width,
      platformOne.height,
      this.x,
      this.y,
      this.size
    );
    let hitTwo = collideRectCircle(
      platformTwo.x,
      platformTwo.y,
      platformTwo.width,
      platformTwo.height,
      this.x,
      this.y,
      this.size
    );
    let hitThree = collideRectCircle(
      platformThree.x,
      platformThree.y,
      platformThree.width,
      platformThree.height,
      this.x,
      this.y,
      this.size
    );

    if (hitOne) {
    this.yvelocity = 0;
    this.gravity = 0;
    this.x += platformOne.speed;
    } 
  
    else if (hitTwo) {
      this.yvelocity = 0;
      this.gravity = 0;
      this.x += platformTwo.speed;
    } 
  
    else if (hitThree) {
      this.yvelocity = 0;
      this.gravity = 0;
      this.x += platformThree.speed;
    } 
  
    else {
      this.gravity = 0.1;
    }
  }

  move() {
    this.yvelocity += this.gravity;
    this.y += this.yvelocity;

    if (this.y + this.size/2 >= height) {
      this.y = height - this.size/2
      this.yvelocity = 0;
      this.gravity = 0
    }

    if (this.x + this.size/2 >= width){
      this.x = width - this.size/2
    }

    if (this.x - this.size/2 <= 0){
      this.x = this.size/2
    }

    if (keyIsDown(this.upKey)) {
      this.y -= this.speed + this.jumpHeight;
      this.direction = "N";
    }

    if (keyIsDown(this.downKey)) {
      this.y += this.speed;
      this.direction = "S";
    }

    if (keyIsDown(this.leftKey)) {
      this.x -= this.speed;
      this.direction = "W";
    }

    if (keyIsDown(this.rightKey)) {
      this.x += this.speed;
      this.direction = "E";
    }
  }

  draw() {
    push();
    fill(this.color);
    ellipse(this.x, this.y, this.size);

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
      this.bullets[i].move();
    }

    pop();
  }

  shoot() {
    if (keyIsDown(this.shootKey)  && !this.shotOnCooldown) {
      bullet = new Bullet(this.x, this.y, this.direction, this.color);
      bulletSound.play()
      this.bullets.push(bullet);
      this.shotCounter = 0;
    }

    this.shotCounter += 1;
    if (this.shotCooldown >= this.shotCounter) {
      this.shotOnCooldown = true;
    } else {
      this.shotOnCooldown = false;
    }
  }
}

class Bullet {
  constructor(x, y, direction, color) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 2;
    this.speed = 3;
    this.direction = direction;
    this.isActive = true;
    this.color = color
  }

  draw() {
    if(!this.isActive) {
      return;
    }
    push();
    fill(this.color);
    if(this.direction === "W" || this.direction === "E"){
      rect(this.x, this.y, this.width, this.height);
    }
    
    else if (this.direction === "N" || this.direction === "S"){
      rect(this.x, this.y, this.height, this.width)
    }
    pop();
  }

  move() {
    if(!this.isActive) {
      return;
    }
    
    if (this.direction === "N") {
      this.y -= this.speed;
    }
    if (this.direction === "S") {
      this.y += this.speed;
    }
    if (this.direction === "W") {
      this.x -= this.speed;
    }
    if (this.direction === "E") {
      this.x += this.speed;
    }
  }
}


//
//
// -------------- GAME OVER ------------
//
//
//

// will display the Game Over screen
function gameOver(Player) {
  let winner = Player.playerNum;
  // this will just reset the background to a black screen;
  // could be edited to be something different
  push();
  background(0);
  stroke(255);
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2 - 50);
  text(`Player ${winner} Wins!`, width / 2, height / 2);
  text("Press SPACEBAR to restart", width / 2, height / 2 + 50);
  if (keyIsPressed && keyCode === 32) {
    restartGame();
  }
  pop();
}

function restartGame() {
  playerOne = new Player(1, width / 4 + 20, 20);
  playerTwo = new Player(2, (3 * width) / 4 + 20, 20);
  loop();
  //If loop() is called, the code in draw() begins to run continuously again.
}

//
//
// ------------- END OF GAME OVER SECTION --------------
//
//


//
//
// ------------- PAUSE --------------
//
//

let pauseCount = 0
function pause(){
  buttonSound.play()
  buttonSound.setVolume(.1)
  pauseCount++
  if (pauseCount % 2 != 0){
    noLoop()
    backgroundMusic.setVolume(0)
  }
  
  if(pauseCount % 2 == 0){
    loop()
    backgroundMusic.setVolume(0.1)
  }
}

//
//
// -------------- END OF PAUSE SECTION -----------
//
//
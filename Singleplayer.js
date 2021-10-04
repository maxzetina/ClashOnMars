let playerOne,
  playerTwo,
  platformOne,
  platformTwo,
  platformThree,
  enemies,
  enemy,
  img,
  bullet,
  mainMenu,
  pauseButton,
  bulletSound,
  backImg,
  backgroundMusic,
  buttonSound,
  deathSound;

function preload() {
  backgroundMusic = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FA%20Reign%20Of%20Ash%20Forever%20Sea%20Of%20Thieves%20Ashen%20Lords%20OST.mp3?v=1628097125196"
  );
  soundFormats("mp3");
  bulletSound = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FRealistic%20Gunshot%20Sound%20Effect.mp3?v=1628094830857"
  );
  bulletSound.setVolume(0.1);
  buttonSound = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FKeyboard%20press%20-%20Sound%20Effect.mp3?v=1628181752889"
  );
  deathSound = loadSound(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2FGrenade%20Explosion%20-%20Sound%20Effect.mp3?v=1628187291108"
  );
}

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  backgroundMusic.play();
  backgroundMusic.loop();
  bulletSound.setVolume(0.2);
  backgroundMusic.setVolume(0.05);
  colorMode(HSB, 360, 100, 100);

  img = loadImage(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Fredplatform.png?v=1627668770121"
  );

  backImg = loadImage(
    "https://cdn.glitch.com/f439602b-564a-48b1-b0d8-f13edacf3e7d%2Flavabackground.png?v=1628091759977"
  );

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

  enemies = [];
  enemy = new Enemy();
  enemies.push(enemy);

  mainMenu = createButton("Main Menu");
  mainMenu.position(10, 410);
  mainMenu.mousePressed(returnToMainMenu);

  pauseButton = createButton("Pause");
  pauseButton.position(200, 410);
  pauseButton.mousePressed(pause);
}

function returnToMainMenu() {
  buttonSound.play();
  //buttonSound.setVolume(0.05);
  setTimeout(function() {
    window.location.replace("./index.html");
  }, 400);
}

function draw() {
  background(backImg);

  //middle platform
  platformOne.main();

  //platform on the right
  platformTwo.main();

  //platform on the left
  platformThree.main();

  //Player One
  playerOne.main();

  //Enemy

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].main();
    enemies[i].takeDamage(playerOne);
    playerOne.takeDamage(enemies[i]);
  }

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
    this.draw();
    this.move();
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
  let healthBarW = playerOne.health;
  let healthBarH = 10;
  fill("white");
  stroke(0);
  strokeWeight(2);
  text(`Enemy Health: ${enemies[0].health}`, 275, 20);
  text(`Score: ${playerOne.score}`, width / 2 - 40, 20);

  fill(50);
  rect(10, 10, 100, healthBarH);

  fill(120, 100, 100);
  rect(10, 10, healthBarW, healthBarH);

  // added this if statement to check for 0 health (i.e game over) and change to gameover screen
  // if game is over, call gameover(winner) which takes the winner player as a parameter
  if (playerOne.health <= 0) {
    gameOver();
  }

  //Start here

  if (enemies[0].health <= 0) {
    deathSound.play();
    deathSound.setVolume(.2)
    
    
    enemies.splice(0, 1);
    enemies.push(new Enemy())
    
    
    
    
    playerOne.score += 5;
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
    this.health = 100;
    this.score = 0;
    this.targetBoxWidth = 50;
    this.targetBoxHeight = 50;

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
      if (!this.bullets[i].isActive) {
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
        this.score += 1;
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
    } else if (hitTwo) {
      this.yvelocity = 0;
      this.gravity = 0;
      this.x += platformTwo.speed;
    } else if (hitThree) {
      this.yvelocity = 0;
      this.gravity = 0;
      this.x += platformThree.speed;
    } else {
      this.gravity = 0.1;
    }
  }

  move() {
    this.yvelocity += this.gravity;
    this.y += this.yvelocity;

    if (this.y + this.size / 2 >= height) {
      this.y = height - this.size / 2;
      this.yvelocity = 0;
      this.gravity = 0;
    }

    if (this.x + this.size / 2 >= width) {
      this.x = width - this.size / 2;
    }

    if (this.x - this.size / 2 <= 0) {
      this.x = this.size / 2;
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

    // target box
    // push()
    // noFill()
    // stroke(120, 100, 100)
    // rect(this.x - this.targetBoxWidth/2, this.y - this.targetBoxHeight/2, this.targetBoxWidth, this.targetBoxHeight)

    // target box corners
    this.cornerOneX = this.x - this.targetBoxWidth / 2; //RED (0, 100, 100)
    this.cornerOneY = this.y - this.targetBoxHeight / 2;
    this.cornerTwoX = this.x - this.targetBoxWidth / 2; //BLUE (240, 100, 100)
    this.cornerTwoY = this.y + this.targetBoxHeight / 2;
    this.cornerThreeX = this.x + this.targetBoxWidth / 2; //YELLOW (45, 100, 100)
    this.cornerThreeY = this.y - this.targetBoxHeight / 2;
    this.cornerFourX = this.x + this.targetBoxWidth / 2; //PINK (315, 100, 100)
    this.cornerFourY = this.y + this.targetBoxHeight / 2;

    //   fill(0, 100, 100)
    //   stroke(0, 100, 100)
    //   circle(this.cornerOneX, this.cornerOneY, 10)
    //   line(this.cornerOneX, this.cornerOneY, enemy.x, enemy.y)

    //   fill(240, 100, 100)
    //   stroke(240, 100, 100)
    //   circle(this.cornerTwoX, this.cornerTwoY, 10)
    //   line(this.cornerTwoX, this.cornerTwoY, enemy.x, enemy.y)

    //   fill(45, 100, 100)
    //   stroke(45, 100, 100)
    //   circle(this.cornerThreeX, this.cornerThreeY, 10)
    //   line(this.cornerThreeX, this.cornerThreeY, enemy.x, enemy.y)

    //   fill(315, 100, 100)
    //   stroke(315, 100, 100)
    //   circle(this.cornerFourX, this.cornerFourY, 10)
    //   line(this.cornerFourX, this.cornerFourY, enemy.x, enemy.y)

    pop();
    // end of target box code

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
      this.bullets[i].move();
    }

    pop();
  }

  shoot() {
    if (keyIsPressed && keyCode === this.shootKey && !this.shotOnCooldown) {
      bullet = new PlayerBullet(this.x, this.y, this.direction);
      bulletSound.play();
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 2;
    this.speed = 3;
    this.isActive = true;
  }
}

class EnemyBullet extends Bullet {
  constructor(x, y) {
    super(x, y);
    this.initialX = x;
    this.initialY = y;

    let corners = [1, 2, 3, 4];
    let corner = random(corners);

    if (corner == 1) {
      this.endX = playerOne.cornerOneX;
      this.endY = playerOne.cornerOneY;
    } else if (corner == 2) {
      this.endX = playerOne.cornerTwoX;
      this.endY = playerOne.cornerTwoY;
    } else if (corner == 3) {
      this.endX = playerOne.cornerThreeX;
      this.endY = playerOne.cornerThreeY;
    } else if (corner == 4) {
      this.endX = playerOne.cornerFourX;
      this.endY = playerOne.cornerFourY;
    }

    let deltaX = abs(this.x - this.endX);
    let deltaY = abs(this.y - this.endY);

    let distance = sqrt(deltaX * deltaX + deltaY * deltaY);

    let neededFrames = distance / this.speed;

    this.xVel = deltaX / neededFrames;
    this.yVel = deltaY / neededFrames;

    // Fourth Q
    if (this.endX > this.initialX && this.endY > this.initialY) {
      this.angle = atan(deltaY / deltaX);
    }

    //First Q
    if (this.endX > this.initialX && this.endY < this.initialY) {
      this.angle = acos(deltaY / distance);
      this.angle += 90;
    }

    //Third Q
    if (this.endX < this.initialX && this.endY > this.initialY) {
      this.angle = acos(deltaY / distance);
      this.angle += 90;
    }

    // Second Q
    if (this.endX < this.initialX && this.endY < this.initialY) {
      this.angle = atan(deltaY / deltaX);
    }
  }

  draw() {
    if (!this.isActive) {
      return;
    }

    push();
    fill(100);

    angleMode(DEGREES);
    translate(this.x, this.y);
    rotate(this.angle);
    rect(0, 0, this.width, this.height);

    pop();
  }

  move() {
    if (!this.isActive) {
      return;
    }

    if (this.endX > this.initialX && this.endY > this.initialY) {
      this.x += this.xVel;
      this.y += this.yVel;
    }

    if (this.endX < this.initialX && this.endY > this.initialY) {
      this.x -= this.xVel;
      this.y += this.yVel;
    }

    if (this.endX < this.initialX && this.endY < this.initialY) {
      this.x -= this.xVel;
      this.y -= this.yVel;
    }

    if (this.endX > this.initialX && this.endY < this.initialY) {
      this.x += this.xVel;
      this.y -= this.yVel;
    }
  }
}

class PlayerBullet extends Bullet {
  constructor(x, y, direction) {
    super(x, y);
    this.direction = direction;
    this.color = playerOne.color;
  }

  draw() {
    if (!this.isActive) {
      return;
    }

    push();
    fill(this.color);
    if (this.direction === "W" || this.direction === "E") {
      rect(this.x, this.y, this.width, this.height);
    } else if (this.direction === "N" || this.direction === "S") {
      rect(this.x, this.y, this.height, this.width);
    }

    pop();
  }

  move() {
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

class Enemy {
  constructor() {
    this.size = random(10, 30);
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.color = random(0, 360);
    this.speed = 2;
    this.bullets = [];

    this.shotCooldown = 15;
    this.shotCounter = 0;
    this.shotOnCooldown = false;
    this.health = 3;
    this.axis = random([0, 1]);

    if (this.axis == 0) {
      if (this.y <= height / 2) {
        this.direction = "S";
      } else {
        this.direction = "N";
      }
    }

    if (this.axis == 1) {
      if (this.x <= width / 2) {
        this.direction = "E";
      } else {
        this.direction = "W";
      }
    }
  }

  main() {
    this.draw();
    this.move();
    this.shoot();
  }

  takeDamage(otherPlayer) {
    for (let i = 0; i < this.bullets.length; i++) {
      if (!this.bullets[i].isActive) {
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
        otherPlayer.health -= 1;
        this.bullets[i].isActive = false;
      }
    }
  }

  draw() {
    push();
    fill(color(this.color, 100, 100));
    ellipse(this.x, this.y, this.size);
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
      this.bullets[i].move();
    }
    pop();
  }

  move() {
    if (this.axis == 0) {
      this.x += this.speed;
      if (this.x >= width - this.size || this.x <= this.size) {
        this.speed *= -1;
      }
    }
    if (this.axis == 1) {
      this.y += this.speed;
      if (this.y >= height - this.size || this.y <= this.size) {
        this.speed *= -1;
      }
    }
  }

  shoot() {
    if (!this.shotOnCooldown) {
      bullet = new EnemyBullet(this.x, this.y);
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

//
//
// -------------- GAME OVER ------------
//
//
//

// will display the Game Over screen; probably call in draw() when/if player's health == 0
function gameOver() {
  // this will just reset the background to a black screen;
  // could be edited to be something different
  push();
  background(0);
  stroke(255);
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2 - 50);
  text(`Score: ${playerOne.score}`, width / 2, height / 2);
  text("Press SPACEBAR to restart", width / 2, height / 2 + 50);
  if (keyIsPressed && keyCode === 32) {
    restartGame();
  }
  pop();
}

function restartGame() {
  playerOne = new Player(1, width / 4 + 20, 20);
  enemies = [];
  enemy = new Enemy();
  enemies.push(enemy);
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

let pauseCount = 0;
function pause() {
  buttonSound.play();
  buttonSound.setVolume(0.05);
  pauseCount++;
  if (pauseCount % 2 != 0) {
    noLoop();
    backgroundMusic.setVolume(0);
  }

  if (pauseCount % 2 == 0) {
    loop();
    backgroundMusic.setVolume(0.1);
  }
}

//
//
// -------------- END OF PAUSE SECTION -----------
//
//
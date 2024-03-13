// ======================================================
                // Game Class 
// ======================================================
class Game {
    constructor(cvs, ctx){
    //images for the game
    this.level_img = new Image();
    this.level_img.src = "img/level.png";
    this.score_img = new Image();
    this.score_img.src = "img/score.png";
    this.live_img = new Image()
    this.live_img.src = "img/love.png";
    this.winner_img = new Image()
    this.winner_img.src = "img/winner.png";
    this.gameover_img = new Image()
    this.gameover_img.src = "img/gameover.png";
    
    this.rightArrow = false;
    this.leftArrow = false;
    this.live = 3; // user live
    this.score = 0;
    this.score_unit = 10;
    this.level =  1;
    this.max_level = 5;
    this.start_game = false;
    this.game_over = false;
    this.startPoint = ' ';
    this.cvs = cvs;
    this.ctx = ctx;
    this.gameover = document.getElementById("gameover");
    this.youwin = document.getElementById("youwin");
    this.youloose = document.getElementById("youloose");
    this.restart = document.getElementById("restart");}    

    // show game score
    gameScore() {
      //draw text
      ctx.fillStyle = "white";
      ctx.font = "20px serif";
      ctx.fillText(this.score, 35, 25);
      // draw image
      ctx.drawImage(this.score_img, 5, 5, 25, 25);
    }
    
    // show game live
    gameLive() {
      //draw text
      ctx.fillStyle = "white";
      ctx.font = "20px serif";
      ctx.fillText(this.live, cvs.width - 25, 25);
      // draw image
      ctx.drawImage(this.live_img, cvs.width - 55, 5, 25, 25);
    }
    
    // show game level
    gameLevel() {
      //draw text
      ctx.fillStyle = "white";
      ctx.font = "20px serif";
      ctx.fillText(this.level, cvs.width/2, 25);
      // draw image
      ctx.drawImage(this.level_img, cvs.width/2 - 30, 5, 25, 25);
    }
    
    }

// ======================================================
                // Bricks Class 
// ======================================================
class Bricks extends Game {
    constructor(){
        super();
        this.row = 3;
        this.column = 5;
        this.width = 55;
        this.height = 10;
        this.offSetLeft = 20;
        this.offSetTop = 20;
        this.marginTop = 40;
        this.fillColor = "#874f9e";
        this.strokeColor = "goldenrod";
        this.bricks = [];
      }

//creating bricks 
createBricks() {
    for (let r = 0; r < this.row; r++) {
  this.bricks[r] = [];
      for (let c = 0; c < this.column; c++) {
        this.bricks[r][c] = {
         x : c * (this.offSetLeft + this.width) + this.offSetLeft,
         y : r * (this.offSetTop + this.height) + this.offSetTop + this.marginTop,
         status : true
      }
      }
    }
  }
  
  // draw the bricks
  drawBricks() {
      for (let r = 0; r < this.row; r++) {
        // bricks[r] = [];
            for (let c = 0; c < this.column; c++) {
           let b =  this.bricks[r][c];
            // if the brick isn't broken
            if (b.status) {
              ctx.fillStyle = this.fillColor;
              ctx.fillRect(b.x, b.y, this.width, this.height);
            }
            }
          }
    }   
}

// ======================================================
                // Paddle Class 
// ======================================================
class Paddle extends Game {
    constructor(){
        super();
        this.paddle_width = 100;
        this.paddle_margin_bottom = 40;
        this.paddle_height = 15;
       this.x = cvs.width/2 - this.paddle_width/2;
       this.y = cvs.height - this.paddle_margin_bottom - this.paddle_height;
       this.width = this.paddle_width;
       this.height = this.paddle_height;
       this.dx = 20;
      }
     // draw paddle
 drawPaddle(){
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(this.x, this.y, this.width, this.height);
}
   // move paddle
 movePaddle() {
  if(this.rightArrow && this.x + this.width < cvs.width ){
  this.x += this.dx;
  } else if(this.leftArrow && this.x > 0){
 this.x -= this.dx;
  }
}
// reset paddle
resetPaddle(){
  this.x = cvs.width/2 - this.paddle_width/2;
  this.y = cvs.height - this.paddle_margin_bottom - this.paddle_height;
  this.width = this.paddle_width;
  this.height = this.paddle_height;
}
}

// ======================================================
                // Ball Class 
// ======================================================
class Ball extends Game{
    constructor(paddle, brick){
        super();
      this.brick = brick;
      this.paddle = paddle;
      this.ball_radius = 8;
      this.x = cvs.width/2;
      this.y = 445 - this.ball_radius;
      this.radius = this.ball_radius;
      this.speed = 4;
      this.dx = 3 * (Math.random() * 2 - 1);
      this.dy = -3; 
      }
// draw the ball
drawBall(){
    ctx.beginPath();
     ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
     ctx.fillStyle = "#9946b2";
     ctx.fill();
     ctx.strokeStyle = "#e2db1f";
    ctx.stroke();
    ctx.closePath();
}
// move the ball
 moveBall() {
  this.x += this.dx;
  this.y += this.dy;
}

// Ball and Wall collision Detection
 ballWallCollision() {
  // right side wall  and left
if (this.x + this.radius > cvs.width || this.x - this.radius < 0) {
  this.dx = - this.dx;
}  
// top wall
if(this.y - this.radius < 0){
this.dy = - this.dy;
}
// bottom wall
if(this.y + this.radius > cvs.height){
this.live--;
this.start_game = false;
this.paddle.resetPaddle();
this.resetBall();
}
}
// ball and paddle collision
ballPaddleCollision() {
  if(this.x < this.paddle.x + this.paddle.width && this.x > this.paddle.x && this.paddle.y < this.paddle.y + this.paddle.height && this.y > this.paddle.y){
    //ball hit paddle point
let collidePoint = this.x - (this.paddle.x + this.paddle.width/2);

// Normalize the values
collidePoint = collidePoint / (this.paddle.width/2);

// Angle Of the Ball
let angle = collidePoint * Math.PI/3;
this.dx = this.speed * Math.sin(angle);
this.dy = - this.speed * Math.cos(angle);
  }  
}
// ball brick collision
ballBrickCollision() {
  for (let r = 0; r < this.brick.row; r++) {
        for (let c = 0; c < this.brick.column; c++) {
       let b =  this.brick.bricks[r][c];
        // if the brick isn't broken
        if (b.status) {
          if (this.x + this.radius > b.x && this.x - this.radius < b.x + this.brick.width && this.y + this.radius > b.y && this.y - this.radius < b.y + this.brick.height) {
            this.dy = - this.dy;
            b.status = false; //brick is broken
            this.score += this.score_unit;
          }
        }
        }
      } 
}

//resetball
resetBall() {
  this.x = cvs.width/2;
  this.y = 445 - this.ball_radius;
  this.dx = 3 * (Math.random() * 2 - 1);
  this.dy = -3  
}

//game over

showYouLoose() {
    this.gameover.style.display ="block";
    this.youloose.style.display = "block";
    this.restart.style.display = "block";
  }
  showYouWin() {
    this.gameover.style.display ="block";
    this.youwin.style.display = "block";
    this.restart.style.display = "block";
  }
  
  gameOver() {
    if (this.live <= 0) {
      this.showYouLoose();
      this.game_over = true;
    }
  }
  
  //level up 
  levelUp() {
  
    let isLevelDone = true;
  
    // check if all bricks are broken
    for (let r = 0; r < this.brick.row; r++) {
     for (let c = 0; c < this.brick.column; c++) {
     isLevelDone = isLevelDone && ! this.brick.bricks[r][c].status;
     }
     }
    
   if (isLevelDone) {
     if (this.level >= this.max_level) {
      this.showYouWin();
       this.game_over = true;
       return;
     }
     this.brick.row++;
     this.brick.createBricks();
     this.speed += 0.5;
     this.start_game = false;
     this.resetBall();
     this.paddle.resetPaddle();
     this.level++;
   }
   
   }
  

}

// ======================================================
                // Entry or Driver 
// ======================================================
let cvs = document.getElementById("myCanvas");
let ctx = cvs.getContext("2d");
let a = new Game(cvs, ctx);
let p =  new Paddle();
let brk = new Bricks();
brk.createBricks();
let b = new Ball(p, brk);
b.drawBall();

//paddle control event
document.addEventListener("keydown", function(event){
  if (event.key == "ArrowLeft") {
          p.leftArrow = true;
          p.movePaddle();
          if (b.start_game == false) {
            b.x = p.x + p.paddle_width/2;
           }
      }else if(event.key == "ArrowRight"){
       p.rightArrow = true;
      p.movePaddle();
      if (b.start_game == false) {
        b.x = p.x + p.paddle_width/2;
       }
      }
  });
  
  document.addEventListener("keyup", function(event){
      if (event.key == "ArrowLeft") {
          p.leftArrow = false;
      }else if(event.key == "ArrowRight"){
       p.rightArrow = false;
      }
  });

  // start the game
document.addEventListener('click', ()=>{
  b.start_game = true;
 });

 document.addEventListener('touchmove', (e)=>{
  var distanceMove = e.touches[0].clientX;
  if (distanceMove <= 300 && distanceMove != 0 && distanceMove > 0) {
   p.x = e.touches[0].clientX;
   if (b.start_game == false) {
    b.x = e.touches[0].clientX + p.paddle_width/2;
   }
  }else if (distanceMove <= 0) {
      p.x = 1;
  }
  
  })

  //click on play again
restart.addEventListener("click", ()=>{
  location.reload();
})

// ===========================
// GAME LOOP
// =======
function loop() {
  // clear the redrawing before moving
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  b.gameScore();
  b.gameLive();
  b.gameLevel();
  b.drawBall();
  b.ballWallCollision();
  b.ballPaddleCollision();
  b.ballBrickCollision();
  b.levelUp();
  b.gameOver();
  brk.drawBricks();
  p.drawPaddle();
  if (b.start_game == true) {
    b.moveBall();
  }
if (a.game_over == false) {
requestAnimationFrame(loop);
}   
}
loop();
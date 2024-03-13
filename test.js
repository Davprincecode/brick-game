//images for the game
const level_img = new Image();
level_img.src = "img/level.png"
const score_img = new Image();
score_img.src = "img/score.png"
const live_img = new Image();
live_img.src = "img/love.png"
const winner_img = new Image();
winner_img.src = "img/winner.png"
const gameover_img = new Image();
gameover_img.src = "img/gameover.png"

let cvs = document.getElementById("myCanvas");
let ctx = cvs.getContext("2d");

// game variable and constants
let rightArrow = false;
let leftArrow = false;
const ball_radius = 8;
const  paddle_width = 100;
const  paddle_margin_bottom = 40;
const paddle_height = 15;
let live = 3 // user live
let score = 0;
let score_unit = 10;
let level =  1;
const max_level = 5;
let start_game = false;
let game_over = false;
var startPoint = ' ';


// create the paddle
const paddle = {
x : cvs.width/2 - paddle_width/2,
y : cvs.height - paddle_margin_bottom - paddle_height,
width : paddle_width,
height : paddle_height,
dx : 5
}

// draw paddle
function drawPaddle(){
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
} 
drawPaddle();

// control paddle
document.addEventListener("keydown", function(event){
  
if (event.key == "ArrowLeft") {
        leftArrow = true;
    }else if(event.key == "ArrowRight"){
     rightArrow = true;
    }
});

document.addEventListener("keyup", function(event){
    if (event.key == "ArrowLeft") {
        leftArrow = false;
    }else if(event.key == "ArrowRight"){
     rightArrow = false;
    }
});

// start the game
document.addEventListener('click', ()=>{
  start_game = true;
 })


//  mobile event
// document.addEventListener('touchstart', (e)=>{
  // e.preventDefault();
  // e.touches[0].clientX - paddle.width;
//  })

//  - paddle.width
document.addEventListener('touchmove', (e)=>{
  var distanceMove = e.touches[0].clientX;
  if (distanceMove <= 300 && distanceMove != 0 && distanceMove > 0) {
   paddle.x = e.touches[0].clientX;
   if (start_game == false) {
    ball.x = e.touches[0].clientX + paddle_width/2;
   }
  }else if (distanceMove <= 0) {
      paddle.x = 1;
  }
  
  })
 


// move paddle
function movePaddle() {
    if(rightArrow && paddle.x + paddle.width < cvs.width ){
    paddle.x += paddle.dx;
    if (start_game == false) {
    ball.x = paddle.x + paddle_width/2;
   }
    }else if(leftArrow && paddle.x > 0){
  paddle.x -= paddle.dx;
  if (start_game == false) {
    ball.x = paddle.x + paddle_width/2;
   }
    }
}

function resetPaddle(){
  paddle.x = cvs.width/2 - paddle_width/2;
  paddle.y = cvs.height - paddle_margin_bottom - paddle_height;
  paddle.width = paddle_width;
  paddle.height = paddle_height;
}

// create the ball
const ball = {
x : cvs.width/2,
y : paddle.y - ball_radius,
radius : ball_radius,
speed : 4,
dx : 3 * (Math.random() * 2 - 1),
dy : -3
}

// draw the ball
function drawBall() {
ctx.beginPath();
 ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
 ctx.fillStyle = "#9946b2";
 ctx.fill();
 ctx.strokeStyle = "#e2db1f";
ctx.stroke();
ctx.closePath();
}

// move the ball
  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

// Ball and Wall collision Detection
function ballWallCollision() {
    // right side wall  and left
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = - ball.dx;
  }  

// top wall
if(ball.y - ball.radius < 0){
ball.dy = - ball.dy;
}

// bottom wall
if(ball.y + ball.radius > cvs.height){
live--;
start_game = false;
resetPaddle();
resetBall();
}
}

// resetBall
function resetBall() {
   ball.x = cvs.width/2;
   ball.y = paddle.y - ball_radius;
   ball.dx = 3 * (Math.random() * 2 - 1);
   ball.dy = -3  
}

// ball and paddle collision
function ballPaddleCollision() {
  if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
    //check where the ball hit the paddle
let collidePoint = ball.x - (paddle.x + paddle.width/2);

// Normalize the values
collidePoint = collidePoint / (paddle.width/2);

// Calculate The Angle Of the Ball

let angle = collidePoint * Math.PI/3;

ball.dx = ball.speed * Math.sin(angle);
ball.dy = - ball.speed * Math.cos(angle);

  }  
}


// create the bricks

const brick = {
  row : 3,
  column : 5,
  width : 55,
  height : 10,
  offSetLeft : 20,
  offSetTop : 20,
  marginTop : 40,
  fillColor : "#874f9e",
  strokeColor : "goldenrod"
}

let bricks = [];
function createBricks() {
  for (let r = 0; r < brick.row; r++) {
bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
    bricks[r][c] = {
       x : c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
       y : r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
       status : true
    }
    }
  }
}
createBricks();

// draw the bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    // bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
       let b =  bricks[r][c];
        // if the brick isn't broken
        if (b.status) {
          ctx.fillStyle = brick.fillColor;
          ctx.fillRect(b.x, b.y, brick.width, brick.height);
          // ctx.strokeStyle = brick.strokeColor;
          // ctx.strokeRect(b.x, b.y, brick.width, brick.height);
        }
        }
      }
}

// ball brick collision
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
       let b =  bricks[r][c];
        // if the brick isn't broken
        if (b.status) {
          if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
            ball.dy = - ball.dy;
            b.status = false; //brick is broken
            score += score_unit;
          }
        }
        }
      } 
}

// show game stat
function showGameStats(text, textX, textY, img, imgX, imgY) {
  //draw text
  ctx.fillStyle = "white";
  ctx.font = "20px serif";
  ctx.fillText(text, textX, textY);

  // draw image
  ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// draw function
function draw() {
  drawPaddle();

  drawBall();

  drawBricks();

  //SHOW SCORE 
  showGameStats(score, 35, 25, score_img, 5, 5);
  //show live
  showGameStats(live, cvs.width - 25, 25, live_img, cvs.width - 55, 5);
  //show level
  showGameStats(level, cvs.width/2, 25, level_img, cvs.width/2 - 30, 5);

}

//game over
function gameOver() {
  if (live <= 0) {
    showYouLoose();
    game_over = true;
  }
}

//level up 
function levelUp() {
 let isLevelDone = true;
 
 // check if all bricks are broken
 for (let r = 0; r < brick.row; r++) {
  for (let c = 0; c < brick.column; c++) {
  isLevelDone = isLevelDone && ! bricks[r][c].status;
  }
  }
 

if (isLevelDone) {
  if (level >= max_level) {
    showYouWin();
    gameOver = true;
    return;
  }
  brick.row++;
  createBricks();
  ball.speed += 0.5;
  start_game = false;
  resetBall();
  resetPaddle();
  level++;
}

}


// update game function
function update () {
    ballWallCollision();
    ballPaddleCollision();
    movePaddle();
    ballBrickCollision();
    levelUp();
    gameOver();
}


// GAME LOOP
function loop() {
    // clear the redrawing before moving
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    draw();
    update();
    if (start_game == true) {
      moveBall();
    }
if (game_over == false) {
  requestAnimationFrame(loop);
}   
}
loop();

//SHOW GAME OVER MESSAGE 

//SELECTING ELEMENT 

const gameover = document.getElementById("gameover");

const youwin = document.getElementById("youwin");

const youloose = document.getElementById("youloose");

const restart = document.getElementById("restart");

//click on play again

restart.addEventListener("click", ()=>{
   location.reload();
})

//show win

function showYouWin() {
  gameover.style.display ="block";
  youwin.style.display = "block";
  restart.style.display = "block";
}

// show loose

function showYouLoose() {
  gameover.style.display ="block";
  youloose.style.display = "block";
  restart.style.display = "block";
}
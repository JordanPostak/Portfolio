var canvas, ctx;
var n = 3,score=0,a=0;
var p=[10,10,10,10];
// Length of each segment of the snake
var segLength = 10;

var foods = []; // Array to hold food positions

// Arrays of x,y positions of each coordinate system 
// one for each segment
// Trick to create arrays filled with zero values
var x = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
var y = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
var mousePos;

var badFoodDuration = 10; // duration in seconds for bad food to disappear
var badFoodTimer = []; // array to hold timer for each bad food

var canvas = document.getElementById("myCanvas");
resizeCanvas();

window.addEventListener('resize', function(event){
    resizeCanvas();
});

const playSnakeGameBtn = document.querySelector('.play-snake-game-btn');
const snakeGamePanel = document.querySelector('.snake-game-panel');

playSnakeGameBtn.addEventListener('click', () => {
  snakeGamePanel.style.display = 'block';
  init();
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var fx = 10+Math.random() * (canvas.width-20);  
var fy = 10+Math.random() * (canvas.height-20);

var addFoodBtn = document.getElementById("add-food-btn");
addFoodBtn.addEventListener("click", function() {
  foods.push(generateFood());
});

function init() {
   ctx = canvas.getContext('2d');
   
  canvas.addEventListener('mousemove', function (evt) {
    mousePos = getMousePos(canvas, evt);
  }, false);

  // Display high score
var highScore = getHighScore();
document.getElementById("high-score").innerHTML = highScore;

  // starts animation
  requestAnimationFrame(animate);
}

function generateFood() {
    var food = {
      x: 10 + Math.random() * (canvas.width - 20),
      y: 10 + Math.random() * (canvas.height - 20),
      isBad: Math.random() < 0.2 // 20% chance of bad food
    };
    return food;
  }

function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
      p = ctx.getImageData(evt.clientX - rect.left, evt.clientY - rect.top, 1, 1).data;
   return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
   };
}

function animate() {
  if (a == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    foodRandom();
    // draw the snake, only when the mouse entered at
    if (mousePos !== undefined) {
      // If snake eats food then change length & update food
      for (var i = 0; i < foods.length; i++) {
        if (
          mousePos.x > foods[i].x - 1 &&
          mousePos.x < foods[i].x + 13 &&
          mousePos.y > foods[i].y - 1 &&
          mousePos.y < foods[i].y + 13
        ) {
          if (foods[i].isBad) {
            // Reset the snake if bad food is eaten
            n = 3;
            x = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
            y = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
            score = 0;
            document.getElementById("score").innerHTML = score;
            document.getElementById("badFoodSound").play();
          } else {
            // Increase length if good food is eaten
            n++;
            score++;
            document.getElementById("score").innerHTML = score;
            changes(n);
            document.getElementById("goodFoodSound").play();
          }
          // Update high score if current score is higher
          if (score > getHighScore()) {
            localStorage.setItem("high-score", score);
          }
          // Generate new position for the eaten food
          foods[i] = generateFood();
        }
        // Draw the food on the canvas
          ctx.fillStyle = foods[i].isBad ? "red" : "green";
          ctx.beginPath();
          ctx.arc(foods[i].x + 6, foods[i].y + 5, 5, 0, Math.PI * 2);
          ctx.fill();
      }
      // Display high score
      var highScore = getHighScore();
      document.getElementById("high-score").innerHTML = highScore;
      drawSnake(mousePos.x, mousePos.y);
    }
    requestAnimationFrame(animate);
  }
}

function updateHighScore(score) {
  if (score > getHighScore()) {
    localStorage.setItem("high-score", score);
  }
}

function getHighScore() {
  var highScore = localStorage.getItem("high-score");
  return highScore ? parseInt(highScore) : 0;
}

function drawSnake(posX, posY) {
  //game over condition with color & border comparison. Head touching any color with 'b'(b of rgb) value 0f 255 is considered as terminating condition.
      if(p[2]==255||posX>canvas.width-2||posY>canvas.height-2)
      {
        // Restart game
        updateHighScore(score);
        return;
      }  
      dragSegment(0, posX, posY);
      for(var i=0; i < x.length-1; i++) {
         dragSegment(i+1, x[i], y[i]);
      }  
}

function dragSegment(i,  xin,  yin) {
   dx = xin - x[i];
   dy = yin - y[i];
  //calculate inclination of co-ordinate system based on the gradient
   angle = Math.atan2(dy, dx);
  //set new origins
   x[i] = xin - Math.cos(angle) * segLength;
   y[i] = yin - Math.sin(angle) * segLength;
  
  ctx.save();
  ctx.translate(x[i], y[i]);
  ctx.rotate(angle);
  
  var segColor;
  
  // Generate funny colors
  if(i==0)
  segColor="red";
  else if (i % 3 == 1)
    segColor = "rgba(255, 255, 255, 255)";
  else if (i % 3 == 2)
    segColor = "rgba(255, 0, 255, 255)";
  else
    segColor = "rgba(0, 0, 255, 255)";

    ctx.fillStyle = segColor;
  ctx.beginPath();
  ctx.arc(0, 0, segLength / 2, 0, Math.PI * 2);
  ctx.fill();

  drawLine(0, 0, segLength, 0, segColor, 10);
  
  ctx.restore();
}
//increase array length when eats food
function changes(n){
	x[n-1] = x[n-2]+100;
	y[n-1] = y[n-2]+100;
}

//generate food at random location
function foodRandom() {
    // Update each food position
    for (var i = 0; i < foods.length; i++) {
      // If food is not initialized yet, set initial position and direction
      if (!foods[i].initialized) {
        foods[i].x = Math.random() * canvas.width;
        foods[i].y = Math.random() * canvas.height;
        foods[i].dx = Math.random() * 2 - 4; // Random direction between -1 and 1 on x-axis
        foods[i].dy = Math.random() * 2 - 4; // Random direction between -1 and 1 on y-axis
        foods[i].initialized = true;
      }
      
      // Update food position based on direction
      foods[i].x += foods[i].dx;
      foods[i].y += foods[i].dy;
    
      // Ensure each food stays within canvas bounds
      if (foods[i].x < 0 || foods[i].x > canvas.width - 13) {
        foods[i].dx *= -1; // Reverse direction on x-axis when food hits left or right boundary
      }
    
      if (foods[i].y < 0 || foods[i].y > canvas.height - 13) {
        foods[i].dy *= -1; // Reverse direction on y-axis when food hits top or bottom boundary
      }
    
      // Draw each food
        ctx.fillStyle = "rgba(0, 191, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(foods[i].x + 6, foods[i].y + 5, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }
  }

  function changeBadFoodToGood() {
    // Iterate over all foods
    for (var i = 0; i < foods.length; i++) {
      // Check if the current food is bad
      if (foods[i].isBad) {
        // Set a timeout to change the food to good after 10 seconds
        setTimeout(function() {
          foods[i].isBad = false;
        }, 10000);
      }
    }
  }

function drawLine(x1, y1, x2, y2, color, width) {
  ctx.save();
  
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  ctx.restore();
}
let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

// ✅ Select the span where computer choice will be shown
const compChoiceText = document.querySelector("#comp-choice");

const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randIdx = Math.floor(Math.random() * 3);
  return options[randIdx];
};

const drawGame = () => {
  msg.innerText = "Game was Draw. Play again.";
  msg.style.backgroundColor = "#081b31";
};

const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
    msg.style.backgroundColor = "green";
  } else {
    compScore++;
    compScorePara.innerText = compScore;
    msg.innerText = `You lost. ${compChoice} beats your ${userChoice}`;
    msg.style.backgroundColor = "red";
  }
};

const playGame = (userChoice) => {
  const compChoice = genCompChoice();

  // ✅ Update the computer choice display
  compChoiceText.innerText = compChoice.charAt(0).toUpperCase() + compChoice.slice(1);

  if (userChoice === compChoice) {
    drawGame();
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      userWin = compChoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      userWin = compChoice === "scissors" ? false : true;
    } else {
      userWin = compChoice === "rock" ? false : true;
    }
    showWinner(userWin, userChoice, compChoice);
  }
};

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

// ✅ SNAKE GAME LOGIC
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas?.getContext("2d");

let box = 20;
let snake = [];
let food;
let score = 0;
let d = "RIGHT";
let game = null;

// 🎮 Button Elements
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function initGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  score = 0;
  d = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
  document.getElementById("snakeScore").innerText = `Score: ${score}`;
}

function direction(event) {
  if (event.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
  else if (event.key === "ArrowUp" && d !== "DOWN") d = "UP";
  else if (event.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
  else if (event.key === "ArrowDown" && d !== "UP") d = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (d === "LEFT") headX -= box;
  if (d === "RIGHT") headX += box;
  if (d === "UP") headY -= box;
  if (d === "DOWN") headY += box;

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision({ x: headX, y: headY }, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Final Score: " + score);
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("snakeScore").innerText = `Score: ${score}`;
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// ✅ Button Handlers + Prevent Scrolling on Arrow Keys
if (canvas) {
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault(); // 🚫 Prevent scrolling
      direction(event);       // 🎯 Update snake direction
    }
  });

  startBtn.addEventListener("click", () => {
    if (!game) {
      game = setInterval(draw, 150);
    }
  });

  pauseBtn.addEventListener("click", () => {
    clearInterval(game);
    game = null;
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(game);
    game = null;
    initGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  });

  initGame(); // Start with fresh game
}

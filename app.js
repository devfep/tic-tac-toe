const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 1;
let gameIsOver = false;

const players = [
  {
    name: "",
    symbol: "X",
  },
  {
    name: "",
    symbol: "O",
  },
];

const playerConfigOverlay = document.getElementById("config-overlay");
const backdropEl = document.getElementById("backdrop");

const player1EditBtnEl = document.getElementById("player-1-edit-btn");
const player2EditBtnEl = document.getElementById("player-2-edit-btn");
const cancelConfigBtnEl = document.getElementById("cancel-config-btn");
const formEl = document.getElementById("form");
const errorsOutputEl = document.getElementById("config-errors");
const startGameBtnEl = document.getElementById("start-game-btn");
const gameAreaEl = document.getElementById("active-game");
const gameBoardElements = document.querySelectorAll("#game-board li");
const activePlayerNameEl = document.getElementById("active-player-name");
const gameOverEl = document.getElementById("game-over");

// event listeners
player1EditBtnEl.addEventListener("click", openPlayerConfig);
player2EditBtnEl.addEventListener("click", openPlayerConfig);
cancelConfigBtnEl.addEventListener("click", closePlayerConfig);
backdropEl.addEventListener("click", closePlayerConfig);
formEl.addEventListener("submit", savePlayerConfig);
startGameBtnEl.addEventListener("click", startGame);
for (const gameBoardEl of gameBoardElements) {
  gameBoardEl.addEventListener("click", selectGameBoard);
}

// functions

function openPlayerConfig(event) {
  editedPlayer = +event.target.dataset.playerid;
  playerConfigOverlay.style.display = "block";
  backdropEl.style.display = "block";
}

function closePlayerConfig() {
  playerConfigOverlay.style.display = "none";
  backdropEl.style.display = "none";
  formEl.firstElementChild.classList.remove("error");
  errorsOutputEl.textContent = "";
  formEl.firstElementChild.lastElementChild.value = "";
}

// prevent default form submission
function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayerName = formData.get("player-name").trim();

  //validation
  if (!enteredPlayerName) {
    event.target.firstElementChild.classList.add("error");
    errorsOutputEl.textContent = "Please enter a valid name!";
    return;
  }

  const updatedPlayerDataEl = document.getElementById(
    `player-${editedPlayer}-data`
  );
  updatedPlayerDataEl.children[1].textContent = enteredPlayerName;

  players[editedPlayer - 1].name = enteredPlayerName;

  closePlayerConfig();
}

function resetGame() {
  activePlayer = 0;
  currentRound = 1;
  gameIsOver = false;
  gameOverEl.firstElementChild.innerHTML =
    'You won, <span id="winner-name">PLAYER NAME</span>!';
  gameOverEl.style.display = "none";

  //   loop thru game data to reset
  let gameBoardIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameData[i][j] = 0;
      gameBoardElements[gameBoardIndex].textContent = "";
      gameBoardElements[gameBoardIndex].classList.remove("disabled");
      gameBoardIndex++;
    }
  }
}

function startGame() {
  if (players[0].name === "" || players[1].name === "") {
    alert("Please set custom name for both players");
    return;
  }

  resetGame();

  activePlayerNameEl.textContent = players[activePlayer].name;
  gameAreaEl.style.display = "block";
}

function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  activePlayerNameEl.textContent = players[activePlayer].name;
}

function selectGameBoard(event) {
  if (gameIsOver) return;

  const selectedCol = event.target.dataset.col - 1;
  const selectedRow = event.target.dataset.row - 1;

  //   prevent subsequent clicking of already clicked tile
  if (gameData[selectedRow][selectedCol] > 0) {
    alert("Please select an empty field");
    return;
  }
  event.target.textContent = players[activePlayer].symbol;
  event.target.classList.add("disabled");

  gameData[selectedRow][selectedCol] = activePlayer + 1;

  const winnerId = checkForGameOver();

  if (winnerId !== 0) {
    endGame(winnerId);
  }

  //   keep tabs on all occupied tiles
  currentRound++;
  switchPlayer();
}

function checkForGameOver() {
  // Row check for equality..go thru all rows and keep cols fixed
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }

  // Col check for equality..go thru all cols and keep rows fixed
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[0][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  // diag check..top-left to bottom-right
  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }

  // diag check..bottom-left to top-right
  if (
    gameData[2][0] > 0 &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }

  //   draw game
  if (currentRound === 9) {
    return -1;
  }
  return 0;
}

function endGame(winnerId) {
  gameIsOver = true;
  gameOverEl.style.display = "block";

  if (winnerId > 0) {
    const winnerName = players[winnerId - 1].name;
    gameOverEl.firstElementChild.firstElementChild.textContent = winnerName;
  } else {
    gameOverEl.firstElementChild.textContent = "It's a draw!";
  }
}

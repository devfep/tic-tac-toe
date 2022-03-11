const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let editedPlayer = 0;
let activePlayer = 0;

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
const gameFieldElements = document.querySelectorAll("#game-board li");
const activePlayerNameEl = document.getElementById("active-player-name");

// event listeners
player1EditBtnEl.addEventListener("click", openPlayerConfig);
player2EditBtnEl.addEventListener("click", openPlayerConfig);
cancelConfigBtnEl.addEventListener("click", closePlayerConfig);
backdropEl.addEventListener("click", closePlayerConfig);
formEl.addEventListener("submit", savePlayerConfig);
startGameBtnEl.addEventListener("click", startGame);
for (const gameFieldEl of gameFieldElements) {
  gameFieldEl.addEventListener("click", selectGameField);
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

function startGame() {
  if (players[0].name === "" || players[1].name === "") {
    alert("Please set custom name for both players");
    return;
  }

  activePlayerNameEl.textContent = players[activePlayer].name;
  gameAreaEl.style.display = "block";
}

// TODO: Determine which li item was clicked and add symbol of active player in the field
// TODO: Switch active player with a diff symbol
// TODO: Disable field that is already occupied with symbol
// TODO: Keep track of all selected fields

function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  activePlayerNameEl.textContent = players[activePlayer].name;
}

function selectGameField(event) {
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

  switchPlayer();
}

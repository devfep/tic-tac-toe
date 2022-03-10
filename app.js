const playerConfigOverlay = document.getElementById("config-overlay");
const backdropEl = document.getElementById("backdrop");

const player1EditBtnEl = document.getElementById("player-1-edit-btn");
const player2EditBtnEl = document.getElementById("player-2-edit-btn");
const cancelConfigBtnEl = document.getElementById("cancel-config-btn");

// event listeners
player1EditBtnEl.addEventListener("click", openPlayerConfig);
player2EditBtnEl.addEventListener("click", openPlayerConfig);
cancelConfigBtnEl.addEventListener("click", closePlayerConfig);
backdropEl.addEventListener("click", closePlayerConfig);

// functions

function openPlayerConfig() {
  playerConfigOverlay.style.display = "block";
  backdropEl.style.display = "block";
}

function closePlayerConfig() {
  playerConfigOverlay.style.display = "none";
  backdropEl.style.display = "none";
}

//DOM SELECTORS
 const startButton = document.querySelector(".js-start-button");
 const statusSpan = document.querySelector(".js-status");
 const heading = document.querySelector("h1");
 const padContainer = document.querySelector(".js-pad-container");

//VARIABLES
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far

 const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("./assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("./assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("./assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("./assets/simon-says-sound-4.mp3"),
  }
];

//EVENT LISTENERS
window.addEventListener("DOMContentLoaded", () => { //Event listener that activates background music to start playing once page loads
  const audio = document.getElementById("bg-music");
  audio.volume = 0.015; // Set volume of background music to 1.5%
});
padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

//EVENT HANDLERS
function startButtonHandler() {
  const level = prompt("Choose a skill level (1-4):");
  const parsedLevel = parseInt(level);
  
  // If user input is invalid (not 1-4) AND if it's not null or undefined, show error and reset
  if (!isNaN(parsedLevel) && (parsedLevel < 1 || parsedLevel > 4)) {
    alert("Please enter level 1, 2, 3, or 4");
    return;
  }
  
  // If user input is blank or NaN, use level 1
  if (isNaN(parsedLevel)) {
    maxRoundCount = 8; // Default for level 1
  } else {
    maxRoundCount = setLevel(parsedLevel);
  }
  
  roundCount++; //increments round
  startButton.classList.add("hidden"); //hides the start button
  statusSpan.classList.remove("hidden");
  playComputerTurn();

  return { startButton, statusSpan };
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find(pad => pad.color === color);
  pad.sound.play();
  checkPress(color);
  return color;
}

//HELPER FUNCTIONS
function setLevel(level) {
  // If level is undefined or null, default to level 1
  if (level === undefined || level === null) {
    return 8; // Default for level 1
  }
  
  if (level < 1 || level > 4) {
    return "Please enter level 1, 2, 3, or 4";
  }
  
  return level * 6 + 2;
}

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

//Sets the status text of a given HTML element with a given a message
function setText(element, text) {
  return element.textContent = text;
}

//Activates a pad of a given color by playing its sound and light
function activatePad(color) {
  const pad = pads.find(pad => pad.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();
  setTimeout(() => pad.selector.classList.remove("activated"), 500);
}

//Activates a sequence of colors passed as an array to the function
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => activatePad(color), index * 600);
  });
}

//Allows the computer to play its turn.
function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  computerSequence.push(getRandomItem(pads).color);
  activatePads(computerSequence);
  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000);
}

//Allows the player to play their turn.
function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  //displays how many rounds are left and removes the 's' once down to 1 round
  setText(statusSpan, `${maxRoundCount - roundCount} Round${maxRoundCount - roundCount === 1 ? '' : 's'} left`);
}

//Checks the player's selection every time the player presses on a pad during the player's turn
function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;
  //displays remaining button presses after the first button is pressed by the player on their turn
  setText(statusSpan, `${remainingPresses} dance step${remainingPresses === 1 ? '' : 's'} left`);
  if (computerSequence[index] !== color) {
    resetGame("Oops! You stomped on your partner's toes. Try again.");
    return;
  }
  if (remainingPresses === 0) {
    checkRound();
  }
}

//Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You completed the full Tango!");
  } else {
    roundCount++;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep dancing!");
    setTimeout(() => playComputerTurn(), 1000);
  }
}

//Resets the game. Called when either the player makes a mistake or wins the game.
function resetGame(text) {
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
  alert(text);
  setText(heading, "Color Tango");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;



import { calculateScore, fetchScore, saveScore } from "./score.js";
import { memoryBot } from "./bot-player.js";

export let CardFaces = [
  "angry-face",
  "baby-face",
  "big-grin-face",
  "closedeyes-laugh-face",
  "confused-face",
  "cool-face",
  "excited-face",
  "loveeyes-face",
  "shocked-face",
  "smile-hearts-face-1",
  "smirk-face",
  "surprised-face",
  "tears-of-joy-face",
  "wink-face",
  "worried-face",

];

let count;

//total match count is counted here
let matchCount = 0;

//total 2 moves is allowed
let moveCount = 0;

//best score will be counted to best score variable
let bestScore = 0;

let isSoundOn = true;
let firstCard = null;
let secondCard = null;
export let lockedCard = false;
export let botRunning = false;


export let currPlayer = 'human';

export function setCurrPlayer(value) {
  currPlayer = value;
}



//game mode is selected from here 
selectedMode("easy");

document.querySelector(".match-count").innerHTML = matchCount;
document.querySelector(".move-count").innerHTML = moveCount;

//winning board will appear after match over
const winningBoard = document.querySelector(".winningpopup");

//NOTE:this shuffle method is not efficient but it good for small games like this.
//future upgrade of this is fisher yate algorithm (best and optimised method)

//game sounds
const flipSound = new Audio("sound-effects/card-flip-sound.mp3");
const successSound = new Audio("sound-effects/success.mp3");
const victorySound = new Audio("sound-effects/Victory Sound Effect.mp3");
const mainGameSound = new Audio("sound-effects/main-game-sound.mp3");

mainGameSound.volume = 0.6;
mainGameSound.loop = true;
mainGameSound.pause(); // switch to play() to again start the sound of the main game
document.addEventListener(
  "click",
  () => {
    mainGameSound.play();
  },
  { once: true },
);

//grid layout based on game mode.
function setGridLayout(mode) {
  const gameBoard = document.querySelector(".gameboard");
  const cards = document.querySelectorAll(".card");

  // Set number of columns based on difficulty
  if (mode === "easy" || mode === "medium") {
    gameBoard.style.gridTemplateColumns = "repeat(6, 1fr)";
  }
  requestAnimationFrame(() => {
    cards.forEach((card) => {
      if (mode === "hard") {
        console.log(mode, "call by play again")
        card.style.width = "130px";
        card.style.height = "150px";
      }
    });
  });
}

//game mode function 
function selectedMode(mode) {
  if (mode === "easy") {
    count = 6;
  } else if (mode === "medium") {
    count = 9;
  } else if (mode === "hard") {
    count = 12;
  } else {
    count = 6;
  }
  renderGameBoard(count);
  setGridLayout(mode);
  return count;
}

//game board rendering function after difficulty mode is getting selected
export function renderGameBoard(count) {
  const GameBoard = document.querySelector(".gameboard");

  GameBoard.innerHTML = "";

  let selectedCart = [...CardFaces]
    .slice(0, count)
    .sort(() => 0.5 - Math.random());

  let cardPairs = [...selectedCart, ...selectedCart];

  cardPairs.sort(() => 0.5 - Math.random()); // You can shuffle again here


  //main game logic 


  cardPairs.forEach((cardName) => {
    //creating an html elememt
    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("img");
    front.classList.add("front");
    front.src = `Images/front-face/${cardName}.png`;

    const back = document.createElement("img");
    back.classList.add("back");
    back.src = `Images/back-face/back-card.png`;

    card.appendChild(front);
    card.appendChild(back);
    GameBoard.appendChild(card);

    //human click

    card.addEventListener("click", () => {
      if (lockedCard || currPlayer !== 'human') return;
      moveCount++;
      document.querySelector(".move-count").innerHTML = Math.floor(
        moveCount / 2,
      );
      if (lockedCard) return;
      if (card.classList.contains("flipped")) return;
      flipSound.currentTime = 0;
      flipSound.volume = 0.6;
      flipSound.play();
      card.classList.add("flipped");

      //first click if card is null - then storing card into first card and return
      if (!firstCard) {
        firstCard = card;
        return;
      }
      //when 2nd click event is triggered the upper if logic will be skipped and 2nd will get
      //locked card marked as true so another click will not applicable
      secondCard = card;
      lockedCard = true;

      const firstImg = firstCard.querySelector(".front").src;
      const secondImg = secondCard.querySelector(".front").src;
      //matching the urls of both card

      if (firstImg === secondImg) {
        matchCount++;
        document.querySelector(".match-count").innerHTML = matchCount;
        successSound.currentTime = 0;
        successSound.play();
        //in case of card match - flip is not done and cards fill remain flipped to its front face
        firstCard = null;
        secondCard = null;
        lockedCard = false;

        const allCards = document.querySelectorAll(".card");
        const allflipped = [...allCards].every((card) =>
          card.classList.contains("flipped"),
        );

        if (allflipped) {
          mainGameSound.pause();
          victorySound.volume = 0.8;
          victorySound.play();
          recordGameTime();
          setTimeout(() => {
            winningBoard.classList.remove("winningpopup-hidden");
          }, 300);
          document.querySelector(".gameScore").innerHTML =
            "Your Score: " +
            calculateScore(
              saveMode || "easy",
              moveCount,
              matchCount,
              minutes,
              seconds,
            );

          let newScore = calculateScore(
            saveMode || "easy",
            moveCount,
            matchCount,
            minutes,
            seconds,
          );

          if (newScore > bestScore) {
            bestScore = newScore;
            saveScore(saveMode, bestScore);
          }

          document.querySelector(".score-count").innerHTML = bestScore;
        }
      } else {
        setTimeout(() => {
          //if match not found then we will again flip it back
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          firstCard = null;
          secondCard = null;
          lockedCard = false;
          currPlayer = 'bot';
          memoryBot();

        }, 1000);
      }
    });
  });
}


//game options -> difficulty levels 

const gameModeOptions = document.querySelector(".mode");
const modeOptions = document.querySelector(".options");

gameModeOptions.addEventListener("click", () => {
  modeOptions.classList.toggle("show");
});

const innerOptions = document.querySelectorAll(".option");
let saveMode = "";

innerOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".mode-name").innerHTML = option.textContent;
    saveMode = option.textContent;
    matchCount = 0;
    moveCount = 0;
    count = selectedMode(saveMode);
    seconds = 0;
    minutes = 0;
    document.querySelector(".timing").innerHTML = `00:00`;
    document.querySelector(".match-count").innerHTML = 0;
    document.querySelector(".move-count").innerHTML = 0;
    const savedScores = fetchScore();
    bestScore = savedScores[saveMode] || 0;
    document.querySelector(".score-count").innerHTML = bestScore;
  });
});

//restart game and resetting everything to default

const restartGame = document.querySelector(".restart");

restartGame.addEventListener("click", () => {
  document.querySelector(".gameboard").innerHTML = " ";

  matchCount = 0;
  moveCount = 0;
  seconds = 0;
  minutes = 0;

  document.querySelector(".match-count").innerHTML = matchCount;
  document.querySelector(".move-count").innerHTML = moveCount;
  document.querySelector(".timing").innerHTML = `00:00`;

  // If no saveMode yet, default to "easy"
  if (!saveMode) saveMode = "easy";

  document.querySelector(".mode-name").innerHTML = saveMode;
  count = selectedMode(saveMode);
  setGridLayout(saveMode);

  const savedScores = fetchScore();
  bestScore = savedScores[saveMode] || 0;
  document.querySelector(".score-count").innerHTML = bestScore;

  if (!mainGameSound.paused) {
    mainGameSound.currentTime = 0;
    mainGameSound.play();
  }
});


//game sound popup
const soundClass = document.querySelector(".gamesoundpopup");
const settingBtn = document.querySelector(".setting");
const cancel = document.querySelector(".cancel");

// Hide on cancel
cancel.addEventListener("click", () => {
  soundClass.classList.add("hidden");
});

// Toggle on settings button
settingBtn.addEventListener("click", () => {
  soundClass.classList.toggle("hidden");
});

const getbtn = document.querySelector(".main-game-sound-button");
const buttonSlider = document.querySelector(".button-slider");
const soundMode = document.querySelector(".main-game-sound-name");

getbtn.addEventListener("click", () => {
  if (mainGameSound.paused) {
    mainGameSound.play();
    getbtn.querySelector("span").textContent = "ON";
    buttonSlider.style.left = " 5px";
  } else {
    mainGameSound.pause();
    getbtn.querySelector("span").textContent = "OFF";
    buttonSlider.style.left = "calc(100% - 25px)";
  }
});

//Instruction Wrapper Around Game Board

const startPage = document.querySelector(".instruction");
const startBtn = document.querySelector(".start-game");
let playerName = "";

startBtn.addEventListener("click", () => {
  startPage.classList.add("instruction-hidden");
  playerName = document.querySelector(".playerName input").value;
  document.querySelector(".winningPlayerName").innerHTML =
    `Congratulations ${playerName}`;
  document.querySelector(".player-name").innerHTML = playerName;
  callTimer();
});

//game timer logic

let [seconds, minutes] = [0, 0];
let timerInterval = null;

function GameTimer() {
  seconds++;
  if (seconds == 60) {
    seconds = 0;
    minutes++;
  }

  let secondsTimer = seconds < 10 ? "0" + seconds : seconds;
  let minuteTimer = minutes < 10 ? "0" + minutes : minutes;

  document.querySelector(".timing").innerHTML =
    `${minuteTimer}:${secondsTimer}`;
}

function callTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(GameTimer, 1000);
}

function recordGameTime() {
  clearInterval(timerInterval);
  console.log(`Final Time: ${minutes} minutes and ${seconds} seconds`);
}

const playAgain = document.getElementById("playagainbtn");


//winning popup 

playAgain.addEventListener("click", () => {
  document.querySelector(".winningpopup").classList.add("winningpopup-hidden");

  matchCount = 0;
  moveCount = 0;
  document.querySelector(".match-count").innerHTML = matchCount;
  document.querySelector(".move-count").innerHTML = moveCount;

  seconds = 0;
  minutes = 0;
  document.querySelector(".timing").innerHTML = `00:00`;
  document.querySelector(".mode-name").innerHTML = saveMode;
  renderGameBoard(selectedMode(saveMode));
  setGridLayout(saveMode)

  //game sound logic is written here.
  isSoundOn = !isSoundOn;

  if (isSoundOn) {
    mainGameSound.play();
    getbtn.querySelector("span").textContent = "ON";
    buttonSlider.style.left = "5px";
  } else {
    mainGameSound.pause();
    getbtn.querySelector("span").textContent = "OFF";
    buttonSlider.style.left = "calc(100% - 25px)";
  }
  document.querySelector(".score-count").innerHTML = bestScore;
  callTimer();

});


const savedScores = fetchScore();
bestScore = savedScores[saveMode] || 0;
document.querySelector(".score-count").innerHTML = bestScore;

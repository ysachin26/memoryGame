const CardFaces = [
  "angry-face",
  "baby-face",
  "big-grin-face",
  "closedeyes-laugh-face",
  "confused-face",
  "cool-face",
  "excited-face",
  "loveeyes-face",
  "shocked-face",
  /*  "smile-hearts-face-1",
  "smirk-face",
  "surprised-face",
  "tears-of-joy-face",
  "wink-face",
  "worried-face",*/
];

let cardPairs = [...CardFaces, ...CardFaces]; //spread operator
cardPairs.sort(() => 0.5 - Math.random());
//NOTE:this shuffle method is not efficient but it good for small games like this.
//future upgrade of this is fisher yate algorithm (best and optimised method)

const GameBoard = document.querySelector(".gameboard");
const flipSound = new Audio("sound-effects/card-flip-sound.mp3");
const successSound = new Audio("sound-effects/success.mp3");
const mainGameSound = new Audio("sound-effects/main-game-sound.mp3");
mainGameSound.play();
mainGameSound.loop = true;
mainGameSound.muted = false;
mainGameSound.volume = 0.5;
let firstCard = null;
let secondCard = null;
let lockedCard = false;

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

  card.addEventListener("click", () => {
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
      successSound.currentTime = 0;
      successSound.play();
      //in case of card match - flip is not done and cards fill remain flipped to its front face
      firstCard = null;
      secondCard = null;
      lockedCard = false;

      const allCards = document.querySelectorAll(".card");
      const allflipped = [...allCards].every((card) =>
        card.classList.contains("flipped")
      );

      if (allflipped) {
        setTimeout(() => {
          alert("you win");
        }, 300);
      }
    } else {
      setTimeout(() => {
        //if match not found then we will again flip it back
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = null;
        secondCard = null;
        lockedCard = false;
      }, 1000);
    }
  });
});

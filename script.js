const CardFaces = [
  "angry-face",
  "baby-face",
  "big-grin-face",
  "closedeyes-laugh-face",
  "confused-face",
  "cool-face",
  "excited-face",
  "happy-face",
  "loveeyes-face",
  "shocked-face",
  "smile-hearts-face-1",
  "smile-hearts-face-2",
  "smirk-face",
  "surprised-face",
  "tears-of-joy-face",
  "wink-face",
  "worried-face",
];

const GameBoard = document.querySelector(".gameboard");
CardFaces.forEach((cardName) => {
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
    card.classList.toggle("flipped");
    setTimeout(() => {
      card.classList.remove("flipped");
    }, 2.0 * 1000);
  });

  function removeTime() {}
});

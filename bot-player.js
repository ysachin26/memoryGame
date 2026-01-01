//bot function 

import { currPlayer, setCurrPlayer } from "./main.js";


export function memoryBot() {

    if (currPlayer !== 'bot') return;
    const cards = document.querySelectorAll('.card');
    let unFlippedCards = [];
    cards.forEach((card) => {

        if (card.classList.contains("flipped")) return;
        else {
            unFlippedCards.push(card)
        }
    })
    if (unFlippedCards.length < 2) return;

    //bot version 1.0 memory - random selection
    let firstFlippedCard = unFlippedCards.sort(() => 0.5 - Math.random());
    let firstCard = firstFlippedCard[0];
    unFlippedCards = unFlippedCards.filter((item) => item != firstCard)
    const secondFlippedCard = unFlippedCards.sort(() => 0.5 - Math.random());
    let secondCard = secondFlippedCard[0];

    //flipping of first card
    setTimeout(() => {
        firstCard.classList.add("flipped");

        setTimeout(() => {
            //flipping of second card
            secondCard.classList.add("flipped");

            const firstImg = firstCard.querySelector(".front").src;
            const secondImg = secondCard.querySelector(".front").src;
            console.log(firstImg)
            console.log(secondImg)
            if (firstImg === secondImg) {
                setTimeout(() => {
                    memoryBot()
                }, 1000)
            }
            else {
                setTimeout(() => {
                    firstCard.classList.remove("flipped");
                    secondCard.classList.remove("flipped");
                    setCurrPlayer('human');
                }, 1000)

            }
        }, 1000)
    }, 1000)

}


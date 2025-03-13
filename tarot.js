document.addEventListener("DOMContentLoaded", () => {
  // Detect touch device
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (!this.classList.contains("tapped")) {
          e.preventDefault();
          navLinks.forEach((l) => l.classList.remove("tapped"));
          this.classList.add("tapped");
        }
      });
    });
  }
});

const deck = document.getElementById("deck");
const drawnCards = document.getElementById("drawn-cards");
const cardFocus = document.getElementById("card-focus");
const overlay = document.getElementById("overlay");
const closeButton = document.getElementById("close-button");
const cardImage = document.querySelector("#card-focus .card-image");
const cardName = document.getElementById("card-name");
const cardOrientation = document.getElementById("card-orientation");
const cardText = document.getElementById("card-text");

const numberOfCards = 78; // Total number of cards
let drawnCardNumbers = [];

deck.addEventListener("click", drawCard);
closeButton.addEventListener("click", closeCardFocus);

function drawCard() {
  if (drawnCardNumbers.length === numberOfCards) {
    alert("The deck is empty!");
    return;
  }

  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * numberOfCards);
  } while (drawnCardNumbers.includes(randomNumber));

  drawnCardNumbers.push(randomNumber);

  const isReversed = Math.random() < 0.5; // 50% chance of being reversed

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  if (isReversed) {
    cardDiv.classList.add("reversed");
  }

  // Create front and back faces
  const frontFace = document.createElement("div");
  frontFace.classList.add("front");
  frontFace.style.backgroundImage = `url('img/${randomNumber}.png')`; // Card face image
  const backFace = document.createElement("div");
  backFace.classList.add("back");

  cardDiv.appendChild(frontFace);
  cardDiv.appendChild(backFace);

  // Flip the card on creation
  setTimeout(() => {
    cardDiv.classList.add("flipped");
  }, 10);

  cardDiv.dataset.cardNumber = randomNumber; // Store the card number
  cardDiv.dataset.reversed = isReversed; // Store the reversed state
  cardDiv.addEventListener("click", focusCard);

  // Randomly position the card
  const randomX = Math.random() * 100 - 50; // -50 to 50
  const randomY = Math.random() * 100 - 50;
  const randomRotation = Math.random() * 90 - 45; // -45 to 45 degrees

  cardDiv.style.left = `${randomX}%`;
  cardDiv.style.top = `${randomY}%`;
  cardDiv.style.transform = `rotate(${randomRotation}deg)`;

  drawnCards.appendChild(cardDiv);
}

function focusCard(event) {
  const card = event.currentTarget;
  const cardNumber = card.dataset.cardNumber;
  const isReversed = card.dataset.reversed === "true";

  cardImage.style.backgroundImage = `url('img/${cardNumber}.png')`;
  cardName.textContent = `Card #${cardNumber}`; // Placeholder
  cardOrientation.textContent = isReversed ? "Reversed" : "Upright"; // Placeholder
  cardText.textContent = `Description for card #${cardNumber} goes here.`; // Placeholder

  cardFocus.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeCardFocus() {
  cardFocus.classList.add("hidden");
  overlay.classList.add("hidden");
}

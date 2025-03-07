document.addEventListener("DOMContentLoaded", () => {
  // Hide the play button and start animation
  const playButton = document.querySelector(".playbutton");
  if (playButton) {
    playButton.addEventListener("click", startAnimation);
  }

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

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar")) {
        navLinks.forEach((link) => link.classList.remove("tapped"));
      }
    });
  }

  // Navbar hover effect
  const navbarLinks = document.querySelectorAll(".navbar a[data-bg]");
  navbarLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      link.style.setProperty("--bg-image", link.getAttribute("data-bg"));
    });
  });
});

function startAnimation() {
  document.querySelector(".playbutton").style.display = "none";

  const images = Array.from(
    document.querySelectorAll(".animated-image")
  ).filter((img) => img.id !== "img2");
  images.sort(() => Math.random() - 0.5); // Fix shuffle logic

  images.forEach((img, index) => {
    const delay = Math.random() * 1000 + 300;
    setTimeout(() => img.classList.add("show"), delay);
  });

  setTimeout(() => document.getElementById("img2").classList.add("show"), 2100);
}

const deck = document.querySelector(".deck");
const drawnCardsContainer = document.querySelector(".drawn-cards");
const descriptionBox = document.querySelector(".card-description");
const tarotPage = document.querySelector(".tarot-page");

// Tarot deck with 78 cards (stored as local images)
const tarotDeck = Array.from({ length: 78 }, (_, i) => `images/t${i + 1}.png`);
let drawnCards = [];

// 🃏 Draw a Card
function drawCard() {
  if (!tarotDeck.length) return;

  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const cardImage = tarotDeck.splice(randomIndex, 1)[0];

  const isReversed = Math.random() > 0.5; // 50% chance of being reversed

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundImage = `url(${cardImage})`;
  card.style.transform = isReversed ? "rotate(180deg)" : "rotate(0deg)";

  // Random stacking offset
  let offsetX = Math.random() * 30 - 15; // Slightly messy look
  let offsetY = Math.random() * 30 - 15;
  card.style.left = `${offsetX}px`;
  card.style.top = `${offsetY}px`;

  // Click: Expand and show description
  card.addEventListener("click", () => expandCard(card, cardImage));

  // Double-Click: Shuffle back into deck
  card.addEventListener("dblclick", () => shuffleBack(card, cardImage));

  drawnCards.push(card);
  drawnCardsContainer.appendChild(card);
}

// 🔍 Expand Card on Click
function expandCard(card, cardImage) {
  // Collapse other expanded cards
  document
    .querySelectorAll(".card.expanded")
    .forEach((c) => c.classList.remove("expanded"));

  // Expand the clicked card
  card.classList.add("expanded");

  // Dim background
  tarotPage.classList.add("dimmed");

  // Show Description
  descriptionBox.textContent = getCardDescription(cardImage);
  descriptionBox.style.opacity = "1";
}

// 🔄 Shuffle Card Back into Deck on Double Click
function shuffleBack(card, cardImage) {
  tarotDeck.push(cardImage);
  card.remove();
  drawnCards = drawnCards.filter((c) => c !== card);

  // If no cards left expanded, remove dim effect
  if (!document.querySelector(".card.expanded")) {
    tarotPage.classList.remove("dimmed");
    descriptionBox.style.opacity = "0";
  }
}

// 📜 Get Card Description
function getCardDescription(cardImage) {
  const cardNumber = cardImage.match(/t(\d+)/)[1];
  return `Card ${cardNumber} Description...`; // Replace with real descriptions
}

// 🎴 Click Deck to Draw a Card
deck.addEventListener("click", drawCard);

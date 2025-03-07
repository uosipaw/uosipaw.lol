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

// ✨ Custom Tarot Card Descriptions
const cardDescriptions = {
  "t1.png": "The Fool: A journey of new beginnings!",
  "t2.png": "The Magician: Power and manifestation!",
  "t3.png": "The High Priestess: Wisdom and intuition!",
  // Add all 78 descriptions here...
};

// 🃏 Draw a Card
function drawCard() {
  if (!tarotDeck.length) return;

  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const cardImage = tarotDeck.splice(randomIndex, 1)[0];

  const isReversed = Math.random() > 0.5;

  const card = document.createElement("div");
  card.classList.add("card", "flipping"); // Flip animation
  card.style.backgroundImage = `url(${cardImage})`;
  card.style.transform = isReversed
    ? "rotateY(180deg) rotate(180deg)"
    : "rotateY(180deg)";

  //Stacking offset
  let offsetX = Math.random() * 30 - 15; // Slightly messy look
  let offsetY = Math.random() * 30 - 15;
  card.style.left = `${offsetX}px`;
  card.style.top = `${offsetY}px`;

  // Remove flip animation after complete
  setTimeout(() => {
    card.classList.remove("flipping");
  }, 800);

  // Click: Expand and show description
  card.addEventListener("click", () => expandCard(card, cardImage));

  // Double-Click: Shuffle back into deck
  card.addEventListener("dblclick", () => shuffleBack(card, cardImage));

  drawnCards.push(card);
  drawnCardsContainer.appendChild(card);
}

// 🔍 Expand Card on Click
function expandCard(card, cardImage) {
  document
    .querySelectorAll(".card.expanded")
    .forEach((c) => c.classList.remove("expanded"));

  card.classList.add("expanded");
  tarotPage.classList.add("dimmed");

  descriptionBox.innerHTML = `
    <p>${
      cardDescriptions[cardImage.split("/").pop()] || "No description available"
    }</p>
    <button class="close-button">Close</button>
  `;
  descriptionBox.style.opacity = "1";

  // Close button event
  document
    .querySelector(".close-button")
    .addEventListener("click", closeDescription);
}

// 🔄 Shuffle Card Back into Deck on Double Click
function shuffleBack(card, cardImage) {
  tarotDeck.push(cardImage);
  card.style.transition = "transform 0.5s ease-in-out";
  card.style.transform = "translate(-400px, 200px) rotateY(0deg)"; // Moves back to deck

  setTimeout(() => {
    card.remove();
    drawnCards = drawnCards.filter((c) => c !== card);
    if (!document.querySelector(".card.expanded")) {
      tarotPage.classList.remove("dimmed");
      descriptionBox.style.opacity = "0";
      descriptionBox.innerHTML = "";
    }
  }, 500);
}

// ✖️ Close Description
function closeDescription() {
  document
    .querySelectorAll(".card.expanded")
    .forEach((c) => c.classList.remove("expanded"));
  tarotPage.classList.remove("dimmed");
  descriptionBox.style.opacity = "0";
  descriptionBox.innerHTML = "";
}

// 🎴 Click Deck to Draw a Card
deck.addEventListener("click", drawCard);

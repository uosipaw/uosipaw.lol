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
  function drawCard() {
    if (!tarotDeck.length) return; // Stop if deck is empty

    const randomIndex = Math.floor(Math.random() * tarotDeck.length);
    const cardImage = tarotDeck.splice(randomIndex, 1)[0]; // Remove the drawn card from the deck

    const isReversed = Math.random() > 0.5; // 50% chance to be upside down

    const card = document.createElement("div");
    card.classList.add("card"); // Add basic card class
    card.style.backgroundImage = `url(${cardImage})`;

    // Set initial position to match the deck location
    card.style.left = "250px";
    card.style.bottom = "250px";
    card.style.transform = "scale(1) rotateY(0deg)";

    drawnCardsContainer.appendChild(card);

    // Delay the movement slightly so the card starts from the deck
    setTimeout(() => {
      card.style.transition =
        "transform 1.2s ease-in-out, left 1.2s ease-in-out, top 1.2s ease-in-out";

      // Move to the center and flip at the halfway point
      card.style.left = "50%";
      card.style.top = "50%";
      card.style.transform = isReversed
        ? "rotateY(180deg) rotateX(180deg) translate(-50%, -50%)"
        : "rotateY(180deg) translate(-50%, -50%)";
    }, 50);

    card.addEventListener("click", () =>
      expandCard(card, cardImage, isReversed)
    ); // Expand on click
    card.addEventListener("dblclick", () => shuffleBack(card, cardImage)); // Shuffle back on double-click

    drawnCards.push(card);
  }
  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const cardImage = tarotDeck.splice(randomIndex, 1)[0]; // Remove the drawn card from the deck

  const isReversed = Math.random() > 0.5; // 50% chance to be upside down

  const card = document.createElement("div");
  card.classList.add("card", "flipping"); // Add the flipping animation
  card.style.backgroundImage = `url(${cardImage})`;

  // Apply upside-down flip (rotateX instead of rotateY)
  card.style.transform = isReversed ? "rotateX(180deg)" : "rotateX(0deg)";

  setTimeout(() => card.classList.remove("flipping"), 1200); // Remove flipping animation after it completes

  card.addEventListener("click", () => expandCard(card, cardImage, isReversed)); // Expand on click
  card.addEventListener("dblclick", () => shuffleBack(card, cardImage)); // Shuffle back on double-click

  drawnCards.push(card);
  drawnCardsContainer.appendChild(card);
}

// 🔍 Expand Card on Click (Maintain Reversed State)
function expandCard(card, cardImage, isReversed) {
  document
    .querySelectorAll(".card.expanded")
    .forEach((c) => c.classList.remove("expanded"));

  card.classList.add("expanded");
  tarotPage.classList.add("dimmed");

  // If the card is reversed, keep it upside down when expanded
  card.style.transform = isReversed
    ? "rotateX(180deg) scale(1.25) rotate(-25deg)"
    : "scale(1.25) rotate(-25deg)";

  descriptionBox.innerHTML = `
    <p>${
      cardDescriptions[cardImage.split("/").pop()] || "No description available"
    }</p>
    <button class="close-button">Close</button>
  `;
  descriptionBox.style.opacity = "1";

  document
    .querySelector(".close-button")
    .addEventListener("click", closeDescription);
}

// Close button event
document
  .querySelector(".close-button")
  .addEventListener("click", closeDescription);

// 🔄 Shuffle Card Back into Deck on Double Click
function shuffleBack(card, cardImage) {
  tarotDeck.push(cardImage);
  card.style.transition = "transform 0.5s ease-in-out";
  card.style.transform = "translate(-800px, 400px) rotateY(0deg)"; // Moves back to deck

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

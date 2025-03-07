function startAnimation() {
  // Hide the button
  document.querySelector(".playbutton").style.display = "none";

  // Get all images except 2.png
  let images = Array.from(document.querySelectorAll(".animated-image")).filter(
    (img) => img.id !== "img2"
  );

  // Shuffle the images
  images.sort(() => Math.random() - 2);

  // Animate images one by one with a random delay
  images.forEach((img, index) => {
    let delay = Math.random() * 1300 + 500; // Random delay between 300ms - 1300ms
    setTimeout(() => {
      img.classList.add("show");
    }, delay);
  });

  // Show 2.png last
  setTimeout(() => {
    document.getElementById("img2").classList.add("show");
  }, 2100);
}

// Initialize navbar functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a touch device
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Apply special handling for touch devices
  if (isTouchDevice) {
    const navLinks = document.querySelectorAll(".navbar a");

    // Make navbar items tap-friendly on touch devices
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // Only prevent default if it's the first click and we're showing the background
        if (!this.classList.contains("tapped")) {
          e.preventDefault();

          // First remove tapped class from all links
          navLinks.forEach((l) => l.classList.remove("tapped"));

          // Then add it to the current one
          this.classList.add("tapped");
        }
      });
    });

    // Close expanded menu when tapping elsewhere
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar")) {
        navLinks.forEach((link) => link.classList.remove("tapped"));
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navbarLinks = document.querySelectorAll(".navbar a[data-bg]");

  navbarLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      const bgValue = link.getAttribute("data-bg");
      link.style.setProperty("--bg-image", bgValue);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navbarLinks = document.querySelectorAll(".navbar a[data-bg]");

  navbarLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      const bgValue = link.getAttribute("data-bg");
      console.log("Setting background image to:", bgValue); // Debugging log
      link.style.setProperty("--bg-image", bgValue);
    });
  });
});

const deck = document.querySelector(".deck");
const drawnCardsContainer = document.querySelector(".drawn-cards");
const descriptionBox = document.querySelector(".card-description");

// Tarot deck with 78 cards (stored as local images)
const tarotDeck = [];
for (let i = 1; i <= 78; i++) {
  tarotDeck.push(`images/t${i}.png`); // Updated filenames
}

let drawnCards = [];
let cardCounter = 0;

// Draw a card
function drawCard() {
  if (tarotDeck.length === 0) return; // Stop if deck is empty

  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const cardImage = tarotDeck.splice(randomIndex, 1)[0];

  const isReversed = Math.random() > 0.5; // 50% chance of reversed

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundImage = `url(${cardImage})`;
  card.style.transform = isReversed ? "rotate(180deg)" : "rotate(0deg)";

  // Stacking effect with slight offset
  let offsetX = Math.random() * 20 - 10;
  let offsetY = Math.random() * 20 - 10;
  card.style.left = `${offsetX}px`;
  card.style.top = `${offsetY}px`;

  // Flip animation
  card.style.animation = "flip 0.5s ease";

  // Add click event to shuffle back into deck
  card.addEventListener("click", () => shuffleBack(card, cardImage));

  drawnCards.push(card);
  drawnCardsContainer.appendChild(card);
  cardCounter++;

  updateHoverEffect();
}

// Shuffle a card back into the deck
function shuffleBack(card, cardImage) {
  tarotDeck.push(cardImage); // Return card to deck
  card.remove();
  drawnCards = drawnCards.filter((c) => c !== card);
  cardCounter--;

  updateHoverEffect();
}

// Update hover effect to only apply to the topmost card
function updateHoverEffect() {
  drawnCards.forEach((card) => card.classList.remove("top-card"));
  if (drawnCards.length > 0) {
    const topCard = drawnCards[drawnCards.length - 1];
    topCard.classList.add("top-card");
    topCard.addEventListener("mouseenter", () => showDescription(topCard));
    topCard.addEventListener("mouseleave", hideDescription);
  }
}

// Show card description
function showDescription(card) {
  descriptionBox.style.visibility = "visible";
  descriptionBox.style.opacity = "1";

  // Extract the number from t1, t2, etc.
  const cardNumber = card.style.backgroundImage.match(/t(\d+)/)[1];
  descriptionBox.textContent = `Card ${cardNumber} Description...`;
}

// Hide card description
function hideDescription() {
  descriptionBox.style.visibility = "hidden";
  descriptionBox.style.opacity = "0";
}

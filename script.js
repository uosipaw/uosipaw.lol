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

// Tarot Deck Logic
const deck = document.querySelector(".deck");
const drawnCardsContainer = document.querySelector(".drawn-cards");
const descriptionBox = document.querySelector(".card-description");

const tarotDeck = Array.from({ length: 78 }, (_, i) => `images/t${i + 1}.png`);
let drawnCards = [];

function drawCard() {
  if (!tarotDeck.length) return;

  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const cardImage = tarotDeck.splice(randomIndex, 1)[0];

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundImage = `url(${cardImage})`;
  card.style.transform =
    Math.random() > 0.5 ? "rotate(180deg)" : "rotate(0deg)";
  card.style.left = `${Math.random() * 20 - 10}px`;
  card.style.top = `${Math.random() * 20 - 10}px`;
  card.style.animation = "flip 0.5s ease";

  card.addEventListener("click", () => shuffleBack(card, cardImage));

  drawnCards.push(card);
  drawnCardsContainer.appendChild(card);

  updateHoverEffect();
}

function shuffleBack(card, cardImage) {
  tarotDeck.push(cardImage);
  card.remove();
  drawnCards = drawnCards.filter((c) => c !== card);
  updateHoverEffect();
}

function updateHoverEffect() {
  drawnCards.forEach((card) => card.classList.remove("top-card"));
  if (drawnCards.length) {
    const topCard = drawnCards[drawnCards.length - 1];
    topCard.classList.add("top-card");
    topCard.addEventListener("mouseenter", () => showDescription(topCard));
    topCard.addEventListener("mouseleave", hideDescription);
  }
}

function showDescription(card) {
  descriptionBox.style.visibility = "visible";
  descriptionBox.style.opacity = "1";
  const cardNumber = card.style.backgroundImage.match(/t(\d+)/)[1];
  descriptionBox.textContent = `Card ${cardNumber} Description...`;
}

function hideDescription() {
  descriptionBox.style.visibility = "hidden";
  descriptionBox.style.opacity = "0";
}

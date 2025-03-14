document.addEventListener("DOMContentLoaded", () => {
  // Initialize the tarot card functionality
  initTarot();

  // Detect touch device for navbar functionality
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

function initTarot() {
  const deck = document.getElementById("deck");
  const drawnCards = document.getElementById("drawn-cards");
  const cardFocus = document.getElementById("card-focus");
  const overlay = document.getElementById("overlay");
  const closeButton = document.getElementById("close-button");
  const cardImage = document.querySelector("#card-focus .card-image");
  const cardName = document.getElementById("card-name");
  const cardOrientation = document.getElementById("card-orientation");
  const cardText = document.getElementById("card-text");

  // Check if necessary elements exist
  if (!deck || !drawnCards || !cardFocus || !overlay || !closeButton) {
    console.error("Required tarot elements not found in the document");
    return;
  }

  const numberOfCards = 78; // Total number of cards
  let drawnCardNumbers = [];
  let cardDescriptionVisible = false;

  deck.addEventListener("click", drawCard);
  closeButton.addEventListener("click", closeCardFocus);

  // Modify the click handler to maintain orientation when sliding
  if (cardImage) {
    cardImage.addEventListener("click", () => {
      if (!cardDescriptionVisible) {
        const isReversed = cardImage.dataset.reversed === "true";

        // Apply the slide class
        cardImage.classList.add("slide");

        // Update transform to maintain orientation while sliding
        if (isReversed) {
          cardImage.style.transform = "translate(-75%, -50%) rotateZ(180deg)";
        } else {
          cardImage.style.transform = "translate(-75%, -50%)";
        }

        cardFocus.classList.add("description-visible");
        cardFocus.classList.add("show-bg");
        cardDescriptionVisible = true;
      }
    });
  }

  // Optimize for mobile: Adjust card positioning for smaller screens
  function getRandomCardPosition() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    let randomX, randomY, randomRotation;

    if (isMobile) {
      // More constrained positions for mobile
      randomX = Math.random() * 40 + 15; // 15% to 55%
      randomY = Math.random() * 60 - 30; // -30% to 30%
      randomRotation = Math.random() * 40 - 20; // -20 to 20 degrees (less rotation)
    } else {
      // Desktop positions
      randomX = Math.random() * 70; // 0 to 70%
      randomY = Math.random() * 80 - 40; // -40% to 40%
      randomRotation = Math.random() * 60 - 30; // -30 to 30 degrees
    }

    return { x: randomX, y: randomY, rotation: randomRotation };
  }

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

    // Create front and back faces with correct positions
    const frontFace = document.createElement("div");
    frontFace.classList.add("front");

    const backFace = document.createElement("div");
    backFace.classList.add("back");
    backFace.style.backgroundImage = `url('./images/${randomNumber}.png')`;

    cardDiv.appendChild(frontFace);
    cardDiv.appendChild(backFace);

    // Add to DOM first before applying animations
    drawnCards.appendChild(cardDiv);

    // Position the card - modified for better mobile experience
    const position = getRandomCardPosition();

    cardDiv.style.left = `${position.x}%`;
    cardDiv.style.top = `${50 + position.y}%`; // Center vertically + random offset
    cardDiv.style.transform = `rotate(${position.rotation}deg)`;

    // Store card data
    cardDiv.dataset.cardNumber = randomNumber;
    cardDiv.dataset.reversed = isReversed;
    cardDiv.dataset.rotation = position.rotation; // Store rotation angle for reference
    cardDiv.addEventListener("click", focusCard);

    // Apply the flipped class immediately to show the front of the card
    cardDiv.classList.add("flipped");

    // If the card is reversed, apply additional rotation
    if (isReversed) {
      backFace.style.transform = "rotateY(180deg) rotateZ(180deg)";
    } else {
      backFace.style.transform = "rotateY(180deg)";
    }
  }

  function focusCard(event) {
    const card = event.currentTarget;
    const cardNumber = card.dataset.cardNumber;
    const isReversed = card.dataset.reversed === "true";

    // Reset modal state
    cardImage.classList.remove("slide");
    cardFocus.classList.remove("description-visible");
    cardDescriptionVisible = false;

    // Set the card image
    cardImage.style.backgroundImage = `url('./images/${cardNumber}.png')`;

    // Apply rotation for reversed cards using rotateZ for cleaner rotation
    if (isReversed) {
      cardImage.style.transform = "translate(-50%, -50%) rotateZ(180deg)";
      cardImage.dataset.reversed = "true";
    } else {
      cardImage.style.transform = "translate(-50%, -50%)";
      cardImage.dataset.reversed = "false";
    }

    // Update text content
    cardName.textContent = `Card #${cardNumber}`;
    cardOrientation.textContent = isReversed ? "Reversed" : "Upright";
    cardText.textContent = `Description for card #${cardNumber} goes here. This would typically include the card's meaning, symbolism, and interpretation both when upright and reversed.`;

    // Show modal
    cardFocus.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Add animation to make the card pulse while maintaining orientation
    if (isReversed) {
      cardImage.style.setProperty("--rotation", "rotateZ(180deg)");
    } else {
      cardImage.style.setProperty("--rotation", "");
    }
    cardImage.style.animation =
      "cardGlow 2s infinite, pulseScale 2s ease infinite";

    // Add background color with slight delay for a nice fade-in effect
    setTimeout(() => {
      cardFocus.classList.add("show-bg");
    }, 100);
  }

  function closeCardFocus() {
    // Add a fade-out effect
    cardFocus.classList.remove("description-visible", "show-bg");

    // Reset transform based on orientation
    const isReversed = cardImage.dataset.reversed === "true";

    if (isReversed) {
      cardImage.style.transform = "translate(-50%, -50%) rotateZ(180deg)";
    } else {
      cardImage.style.transform = "translate(-50%, -50%)";
    }

    cardImage.classList.remove("slide");

    // Wait for the animation to complete before hiding
    setTimeout(() => {
      cardFocus.classList.add("hidden");
      overlay.classList.add("hidden");
      cardImage.style.animation = "";
      cardDescriptionVisible = false;
    }, 500);
  }

  // Make sure the overlay also closes the modal when clicked
  if (overlay) {
    overlay.addEventListener("click", closeCardFocus);
  }

  // Optimize modal interaction for touch devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    // Improve touch target size for mobile
    if (cardImage) {
      cardImage.style.minWidth = "44px";
      cardImage.style.minHeight = "44px";
    }

    // Add swipe down to close functionality
    let touchStartY = 0;
    let touchEndY = 0;

    cardFocus.addEventListener(
      "touchstart",
      function (e) {
        touchStartY = e.changedTouches[0].screenY;
      },
      false
    );

    cardFocus.addEventListener(
      "touchend",
      function (e) {
        touchEndY = e.changedTouches[0].screenY;
        if (touchEndY - touchStartY > 100) {
          // Swipe down of at least 100px
          closeCardFocus();
        }
      },
      false
    );
  }

  // Log initialization success
  console.log("Tarot card functionality initialized");
}

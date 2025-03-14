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

        // No need to manually set transform here - handled by CSS now

        cardFocus.classList.add("description-visible");
        cardFocus.classList.add("show-bg");
        cardDescriptionVisible = true;
      }
    });
  }

  // Optimize for mobile: Adjust card positioning for smaller screens
  function getRandomCardPosition() {
    const container = document.querySelector(".drawncontainer");
    const containerRect = container.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    // Calculate safe positioning area
    const cardWidth = 200; // Width of card in pixels
    const cardHeight = 320; // Height of card in pixels
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate safe margins to keep cards fully visible
    const safeMarginX = (cardWidth / containerWidth) * 100; // Convert to percentage
    const safeMarginY = (cardHeight / containerHeight) * 100; // Convert to percentage

    // Define positioning limits that ensure full visibility
    let xMin, xMax, yMin, yMax, rotationRange;

    if (isMobile) {
      xMin = 5;
      xMax = 70 - safeMarginX; // Ensure right side of card is visible
      yMin = -25; // From center
      yMax = 25; // From center
      rotationRange = 15; // Less rotation on mobile
    } else {
      xMin = 5;
      xMax = 75 - safeMarginX; // Ensure right side of card is visible
      yMin = -35; // From center
      yMax = 35; // From center
      rotationRange = 20;
    }

    // Calculate random position with safety limits
    const randomX = Math.min(Math.max(xMin, Math.random() * xMax), xMax);
    const randomY = Math.min(
      Math.max(yMin, Math.random() * (yMax - yMin) + yMin),
      yMax
    );
    const randomRotation = Math.random() * rotationRange * 2 - rotationRange;

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

    // Darken existing cards before adding new ones
    updateCardStackDepth();

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.dataset.stackIndex = drawnCardNumbers.length - 1; // Add stack index for darkening effect

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

    // Position the card with improved positioning for full visibility
    const position = getRandomCardPosition();

    // Center the card vertically with offset and use absolute positioning
    cardDiv.style.left = `${position.x}%`;
    cardDiv.style.top = `${50 + position.y * 0.7}%`; // Scale down Y offset for better visibility

    // Remove the margin-based positioning and use transform for rotation only
    cardDiv.style.marginTop = "0"; // Don't use margin for positioning
    cardDiv.style.transform = `translate(0, -50%) rotate(${position.rotation}deg)`;

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

    // Set z-index based on card order - HIGHER index for NEWER cards
    cardDiv.style.zIndex = 50 + drawnCardNumbers.length; // Start at 50 to ensure newer cards are on top
  }

  // Function to update darkness of cards based on their position in the stack
  function updateCardStackDepth() {
    const allCards = document.querySelectorAll("#drawn-cards .card");
    const totalCards = allCards.length;

    if (totalCards > 0) {
      allCards.forEach((card) => {
        // Get the stack index and calculate darkness (newer cards are brighter)
        const stackIndex = parseInt(card.dataset.stackIndex) || 0;
        // Calculate a brightness percentage (100% for newest, down to 60% for oldest)
        const brightness = Math.max(60, 100 - stackIndex * 5);
        // Apply a filter with varying brightness and slight blur for depth
        card.style.filter = `brightness(${brightness}%) contrast(${brightness}%)`;
        // Also adjust the z-index to ensure stacking order (newer cards on top)
        card.style.zIndex = 50 + stackIndex; // Higher z-index for newer cards
      });
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

    // Set data attribute for CSS to handle rotation
    cardImage.dataset.reversed = isReversed ? "true" : "false";

    // Clear any inline transforms that might interfere with CSS rules
    cardImage.style.transform = "";

    // Update text content
    cardName.textContent = `Card #${cardNumber}`;
    cardOrientation.textContent = isReversed ? "Reversed" : "Upright";
    cardText.textContent = `Description for card #${cardNumber} goes here. This would typically include the card's meaning, symbolism, and interpretation both when upright and reversed.`;

    // Show modal
    cardFocus.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Add animation to make the card pulse while maintaining orientation
    cardImage.style.animation = "cardGlow 5s infinite";

    // Add background color with slight delay for a nice fade-in effect
    setTimeout(() => {
      cardFocus.classList.add("show-bg");
    }, 100);
  }

  function closeCardFocus() {
    // Add a fade-out effect
    cardFocus.classList.remove("description-visible", "show-bg");

    // Remove the slide class but keep the reversed data attribute
    cardImage.classList.remove("slide");

    // Reset transform based on orientation
    const isReversed = cardImage.dataset.reversed === "true";

    if (isReversed) {
      cardImage.style.transform = "translate(-50%, -50%) rotateZ(180deg)";
    } else {
      cardImage.style.transform = "translate(-50%, -50%)";
    }

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

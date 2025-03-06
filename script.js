function startAnimation() {
  // Hide the button
  document.querySelector(".playbutton").style.display = "none";

  // Get all images except 2.png
  let images = Array.from(document.querySelectorAll(".animated-image")).filter(
    (img) => img.id !== "img2"
  );

  // Shuffle the order for a random pop-in effect
  images.sort(() => Math.random() - 0.5);

  // Animate images one by one with a fixed delay of 400ms
  images.forEach((img, index) => {
    let delay = index * 400;
    let rotate = Math.random() * 20 - 6 + "deg"; // Random rotation between -12deg to 8deg
    let xOffset = Math.random() * 10 - 7 + "px"; // Random x-axis shift
    let yOffset = Math.random() * 15 - 5 + "px"; // Random y-axis shift

    img.style.setProperty("--rotate", rotate);
    img.style.setProperty("--x-offset", xOffset);
    img.style.setProperty("--y-offset", yOffset);

    setTimeout(() => {
      img.classList.add("show");
    }, delay);
  });

  // Show 2.png last after all others
  setTimeout(() => {
    let img2 = document.getElementById("img2");
    img2.style.setProperty("--rotate", Math.random() * 20 - 10 + "deg");
    img2.style.setProperty("--x-offset", Math.random() * 10 - 5 + "px");
    img2.style.setProperty("--y-offset", Math.random() * 15 - 7.5 + "px");
    img2.classList.add("show");
  }, 2800); // Ensures 2.png appears last
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

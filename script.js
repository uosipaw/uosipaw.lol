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

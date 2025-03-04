document.addEventListener("DOMContentLoaded", () => {
  const heading = document.createElement("h1");
  heading.textContent = "Welcome to uosipaw.lol";
  document.body.appendChild(heading);

  const paragraph = document.createElement("p");
  paragraph.textContent = "This is a sample paragraph.";
  document.body.appendChild(paragraph);

  const navBar = document.querySelector(".nav-bar");
  let touchStartX = 0;
  let touchEndX = 0;

  // Handle swipe gestures
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      // Min swipe distance
      if (swipeDistance > 0) {
        // Swipe right - show nav
        navBar.style.left = "0";
      } else {
        // Swipe left - hide nav
        navBar.style.left = "-100%";
      }
    }
  }
});

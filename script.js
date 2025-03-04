document.addEventListener("DOMContentLoaded", () => {
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

  const menuToggle = document.querySelector(".menu-toggle[type='checkbox']");
  const navLinks = document.querySelectorAll(".nav-li");

  menuToggle.addEventListener("change", () => {
    if (menuToggle.checked) {
      navLinks.forEach((link, index) => {
        setTimeout(() => {
          link.style.opacity = "1";
        }, 100 * index);
      });
    } else {
      navLinks.forEach((link) => {
        link.style.opacity = "0";
      });
    }
  });
});

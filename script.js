function startAnimation() {
  // Hide only the button, NOT the whole div
  document.querySelector(".playbutton").style.display = "none";

  // Show the video instantly
  document.getElementById("animationVideo").style.display = "block";
}

function startAnimation() {
  // Hide the button
  document.querySelector(".playbutton").style.display = "none";

  // Get all images except 2.png
  let images = Array.from(document.querySelectorAll(".animated-image")).filter(
    (img) => img.id !== "img2"
  );

  // Shuffle the order for a random pop-in effect
  images.sort(() => Math.random() - 0.5);

  // Animate images one by one with a fixed delay of 750ms
  images.forEach((img, index) => {
    let delay = index * 400; // 750ms delay between each image
    let rotate = Math.random() * 20 - 12 + "deg"; // Random rotation between -10deg to 10deg
    let xOffset = Math.random() * 10 - 5 + "px"; // Random x-axis shift
    let yOffset = Math.random() * 15 - 7.5 + "px"; // Random y-axis shift

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
  }, 3000); // Ensures 2.png appears last
}

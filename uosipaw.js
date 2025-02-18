document.addEventListener("DOMContentLoaded", () => {
    const homeButtonDiv = document.querySelector('.homebuttoncontent');
    const elements = homeButtonDiv.children;
    const randomPageButton = document.getElementById("random-page-button");
    const navbarLinks = document.querySelectorAll(".navbar a");
    const contentDiv = document.getElementById("content");

    // Function to get random position for an element
    function getRandomPosition(element) {
        const rect = element.getBoundingClientRect();
        const x = Math.random() * (window.innerWidth - rect.width);
        const y = Math.random() * (window.innerHeight - rect.height);
        return { x, y };
    }
    // Function to set random position for an element
    function setRandomPosition(element) {
        const { x, y } = getRandomPosition(element);
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }
    // Function to handle click events and transition to the next element
    function handleElementClick(element, nextElement, randomPageButton) {
        let isClicked = false;
        element.addEventListener("click", () => {
            if (isClicked) return;
            isClicked = true;

            element.classList.add('fade-out');
            setTimeout(() => {
                element.style.display = "none";
                if (nextElement) {
                    nextElement.style.display = "block";
                    nextElement.classList.add('fade-in');
                    setRandomPosition(nextElement);
                } else if (randomPageButton) {
                    randomPageButton.style.display = "block";
                    randomPageButton.classList.add('fade-in');
                    setRandomPosition(randomPageButton);
                }
            }, 1000);
        });
    }
    // Initialize elements with click handlers and random positions
    Array.from(elements).forEach((element, index) => {
        const nextElement = elements[index + 1];
        handleElementClick(element, nextElement, randomPageButton);
        setRandomPosition(element);
        if (index !== 0) {
            element.style.display = "none";
        }
    });

    if (randomPageButton) {
        setRandomPosition(randomPageButton);
        randomPageButton.style.display = "none";
    }

    // Handle random page button click
    if (randomPageButton) {
        randomPageButton.addEventListener("click", () => {
            const randomLink = navbarLinks[Math.floor(Math.random() * navbarLinks.length)];
            window.location.href = randomLink.href;
        });
    }

    // Handle navbar link clicks
    navbarLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = link.getAttribute("href");
            loadPage(page);
        });
    });

    // Function to load the content of the clicked page
    function loadPage(page) {
        contentDiv.innerHTML = `<p>Loading ${page}...</p>`;
        // Simulate loading page content
        setTimeout(() => {
            contentDiv.innerHTML = '<p>Content of ' + page + '</p>';
        }, 1000);
    }

    // Make h1header1 appear on screen load
    const h1header1 = document.getElementById("h1header1");
    if (h1header1) {
        h1header1.style.opacity = "1";
        h1header1.style.visibility = "visible";
    }
});
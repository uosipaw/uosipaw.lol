document.addEventListener("DOMContentLoaded", () => {
    const homeButtonContentDiv = document.querySelector('.homebuttoncontent'); // Fixed typo
    const elements = homeButtonContentDiv.children;
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

    // Function to create home button elements
    function createHomeButton() {
        const homeButtonDiv = document.querySelector('.homebutton');

        const elements = [
            { tag: 'h1', id: 'h1header1', text: 'hey' },
            { tag: 'h2', id: 'h2header2', text: 'you ready to go?' },
            { tag: 'h2', id: 'h2header3', text: "we're just looking at whatever" },
            { tag: 'h2', id: 'h2header4', text: "it's important to learn something new everyday" },
            { tag: 'h2', id: 'h2header5', text: 'instead of just staring at your messages' },
            { tag: 'p', id: 'pheader6', text: 'or lack there of' },
            { tag: 'p', id: 'pheader7', text: "she's not going to respond btw" },
            { tag: 'p', id: 'pheader8', text: 'if she was going to she would have by now...' },
            { tag: 'h2', id: 'h2header9', text: 'anyway, let me just grab my vape and we\'ll bounce' },
            { tag: 'h1', id: 'h1header10', text: '.........' },
            { tag: 'h1', id: 'h1header11', text: 'have u seen my vape' },
            { tag: 'h2', id: 'h2header12', text: 'i think youre sitting on it' },
            { tag: 'p', id: 'pheader13', text: 'can you just stand up for a second' },
            { tag: 'button', id: 'random-page-button', text: "nvm i found it, let's go", className: 'random-page-button', ariaLabel: 'Random Page Button' }
        ];

        elements.forEach(el => {
            const element = document.createElement(el.tag);
            element.id = el.id;
            element.textContent = el.text;
            if (el.className) element.className = el.className;
            if (el.ariaLabel) element.setAttribute('aria-label', el.ariaLabel);
            homeButtonDiv.appendChild(element);
        });
    }

    createHomeButton();
});

document.addEventListener("DOMContentLoaded", () => {
    const sequence = [
        'h1header1', 'h2header2', 'h2header3', 'h2header4', 'h2header5',
        'pheader6', 'pheader7', 'pheader8', 'h1header10', 'h2header9',
        'h1header11', 'h2header12', 'pheader13', 'random-page-button'
    ];

    let currentIndex = 0;

    function getRandomPosition() {
        const padding = 100;
        const maxWidth = window.innerWidth - padding * 2;
        const maxHeight = window.innerHeight - padding * 2;
        return {
            x: Math.floor(Math.random() * maxWidth) + padding,
            y: Math.floor(Math.random() * maxHeight) + padding
        };
    }

    function showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            // Position first
            const position = getRandomPosition();
            element.style.position = 'absolute';
            element.style.left = `${position.x}px`;
            element.style.top = `${position.y}px`;

            // Force reflow
            void element.offsetWidth;

            // Then show with transition
            element.style.visibility = 'visible';
            requestAnimationFrame(() => {
                element.classList.add('visible');
            });
        }
    }

    function hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('visible');
            setTimeout(() => {
                element.style.visibility = 'hidden';
            }, 500);
        }
    }

    // Initialize elements
    sequence.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            if (index !== 0) {
                element.style.visibility = 'hidden';
                element.classList.remove('visible');
            }

            element.addEventListener('click', () => {
                if (id === 'random-page-button') {
                    const pages = ['tarot', 'nearme', 'food', 'howto', 'bartletts',
                        'nonprofit', 'art', 'bugs', 'mammals', 'reptiles',
                        'fish', 'birds', 'dinosaurs', 'trivia', 'poem',
                        'wotd', 'page21', 'people', 'mtg', 'knowyourmeme',
                        'folklore', 'about'];
                    const randomPage = pages[Math.floor(Math.random() * pages.length)];
                    window.location.href = `${randomPage}.html`;
                } else if (currentIndex < sequence.length - 1) {
                    hideElement(sequence[currentIndex]);
                    currentIndex++;
                    setTimeout(() => {
                        showElement(sequence[currentIndex]);
                    }, 500); // Match this with CSS transition duration
                }
            });
        }
    });

    // Show first element immediately
    showElement(sequence[0]);
});

// Handle loading screen
const loadingScreen = document.querySelector(".loadingScreen");
window.addEventListener('load', function () {
    loadingScreen.style.display = 'none';
});
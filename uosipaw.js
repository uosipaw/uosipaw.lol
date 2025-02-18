document.addEventListener("DOMContentLoaded", () => {
    const homeButtonDiv = document.querySelector('.homebutton');
    const elements = homeButtonDiv.children;
    const randomPageButton = document.getElementById("random-page-button");
    const navbarLinks = document.querySelectorAll(".navbar a");
    const contentDiv = document.getElementById("content");

    console.log("DOMContentLoaded event fired");
    console.log("randomPageButton:", randomPageButton);

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
        const handleClick = () => {
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
        };

        element.addEventListener("click", handleClick);
        element.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                handleClick();
            }
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
        const handleRandomPageClick = () => {
            const randomLink = navbarLinks[Math.floor(Math.random() * navbarLinks.length)];
            window.location.href = randomLink.href;
        };

        randomPageButton.addEventListener("click", handleRandomPageClick);
        randomPageButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                handleRandomPageClick();
            }
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
        const homeButtonDiv = document.querySelector('.random-page-button');

        const elements = [
            { tag: 'h1', id: 'h1header1', text: 'hey' },
            { tag: 'h2', id: 'h2header2', text: 'follow me' },
            { tag: 'h2', id: 'h2header3', text: "i want to show u something" },
            { tag: 'h2', id: 'h2header4', text: "it's a surprise" },
            { tag: 'h2', id: 'h2header5', text: 'but trust me, it\'s definitely cool' },
            { tag: 'p', id: 'pheader6', text: 'i\'m like an expert on what\'s cool' },
            { tag: 'p', id: 'pheader7', text: "keep going.." },
            { tag: 'p', id: 'pheader8', text: 'alright, we\'re almost there..' },
            { tag: 'h2', id: 'h2header9', text: "where's my vape?????" },
            { tag: 'h1', id: 'h1header10', text: 'WAIT' },
            { tag: 'h1', id: 'h1header11', text: 'omg i just had it two seconds ago' },
            { tag: 'h2', id: 'h2header12', text: 'are u sitting on it?' },
            { tag: 'p', id: 'pheader13', text: 'can you just stand up for a second...' },
            { tag: 'button', id: 'random-page-button', text: "omg nvm i found it, let's go!", className: 'random-page-button', ariaLabel: 'Random Page Button' }
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
        const container = document.querySelector('.homebuttoncontent');
        const containerRect = container.getBoundingClientRect();

        // Get element dimensions (assuming max size of 200px)
        const elementWidth = 200;
        const elementHeight = 100;

        // Calculate available space
        const maxX = containerRect.width - elementWidth;
        const maxY = containerRect.height - elementHeight;

        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    }

    function showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            const position = getRandomPosition();
            element.style.position = 'absolute';
            element.style.left = `${position.x}px`;
            element.style.top = `${position.y}px`;

            void element.offsetWidth;
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

            const handleClick = () => {
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
            };

            element.addEventListener('click', handleClick);
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    handleClick();
                }
            });
        }
    });

    // Show first element immediately
    showElement(sequence[0]);

    // Add skip button functionality
    const skipButton = document.getElementById('skip-button');
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            sequence.forEach((id, index) => {
                const element = document.getElementById(id);
                if (element && id !== 'random-page-button') {
                    hideElement(id);
                }
            });

            // Show random page button
            currentIndex = sequence.length - 1;
            setTimeout(() => {
                showElement('random-page-button');
            }, 500);

            // Hide skip button
            skipButton.classList.add('hidden');
        });
    }
});
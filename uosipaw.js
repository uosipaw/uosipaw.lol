document.addEventListener("DOMContentLoaded", () => {
    const homeButtonDiv = document.querySelector('.homebuttoncontent');
    const elements = homeButtonDiv.children;
    const randomPageButton = document.getElementById("random-page-button");
    const navbarLinks = document.querySelectorAll(".navbar a");
    const contentDiv = document.getElementById("content");

    // Custom order of elements
    const customOrder = [
        'h1header1', 'h2header2', 'h2header3', 'h2header4', 'h2header5',
        'pheader6', 'pheader7', 'pheader8', 'h1header10', 'h2header9',
        'h1header11', 'h2header12', 'pheader13', 'random-page-button'
    ];

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
    customOrder.forEach((id, index) => {
        const element = document.getElementById(id);
        const nextElement = document.getElementById(customOrder[index + 1]);
        if (element) {
            handleElementClick(element, nextElement, randomPageButton);
            setRandomPosition(element);
            if (index !== 0) {
                element.style.display = "none";
            }
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
    async function loadPage(page) {
        const contentDiv = document.querySelector('.content-wrapper');

        try {
            // Show loading state
            contentDiv.innerHTML = `
                <div class="loading">
                    Loading ${page.split('.')[0]}
                </div>`;

            // Simulate minimum loading time for better UX
            const [response] = await Promise.all([
                fetch(page),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();

            // Fade out loading state and fade in content
            contentDiv.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 200));
            contentDiv.innerHTML = content;
            contentDiv.style.opacity = '1';

        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>Could not load ${page}</p>
                    <p>Error: ${error.message}</p>
                    <button onclick="window.location.reload()">Retry</button>
                </div>`;
        }
    }

    // Make h1header1 appear on screen load
    const h1header1 = document.getElementById("h1header1");
    if (h1header1) {
        h1header1.style.opacity = "1";
        h1header1.style.visibility = "visible";
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const homeButtonDiv = document.querySelector('.homebutton');
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

/* filepath: /C:/Users/uosip/.vscode/uosipaw.lol/uosipaw.js */
function initializeSequence() {
    const pages = [
        'tarot.html', 'nearme.html', 'food.html', 'howto.html', 'bartletts.html', 
        'nonprofit.html', 'art.html', 'bugs.html', 'mammals.html', 'reptiles.html', 
        'fish.html', 'birds.html', 'dinosaurs.html', 'trivia.html', 'poem.html', 
        'wotd.html', 'page21.html', 'people.html', 'mtg.html', 'knowyourmeme.html', 
        'folklore.html', 'about.html'
    ];

    const sequence = [
        'h1header1', 'h2header2', 'h2header3', 'h2header4', 'h2header5',
        'pheader6', 'pheader7', 'pheader8', 'h2header9', 'h1header10',
        'h1header11', 'h2header12', 'pheader13', 'random-page-button'
    ];

    let currentIndex = 0;

    function randomPosition(element) {
        const padding = 50; // Padding from edges
        const maxX = window.innerWidth - element.offsetWidth - padding;
        const maxY = window.innerHeight - element.offsetHeight - padding;
        
        element.style.left = Math.random() * maxX + padding + 'px';
        element.style.top = Math.random() * maxY + padding + 'px';
    }

    function showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('hidden');
            element.classList.add('visible', 'clickable');
            randomPosition(element);
        }
    }

    function hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('visible', 'clickable');
            element.classList.add('hidden');
        }
    }

    // Initialize all elements as hidden
    sequence.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
            element.addEventListener('click', handleClick);
        }
    });

    function handleClick(event) {
        const currentId = sequence[currentIndex];
        hideElement(currentId);
        currentIndex++;

        if (currentIndex < sequence.length) {
            showElement(sequence[currentIndex]);
        }

        if (event.target.id === 'random-page-button') {
            const randomPage = pages[Math.floor(Math.random() * pages.length)];
            window.location.href = randomPage;
        }
    }

    // Show the first element
    showElement(sequence[0]);
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', initializeSequence);
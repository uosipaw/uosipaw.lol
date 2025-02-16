document.addEventListener("DOMContentLoaded", () => {
	// Get elements
	const headers = document.querySelectorAll(".homebutton > *");
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
	function handleHeaderClick(element, nextElement, randomPageButton) {
		element.addEventListener("click", () => {
			element.style.opacity = 0;
			setTimeout(() => {
				element.style.display = "none";
				if (nextElement) {
					nextElement.style.display = "block";
					nextElement.style.opacity = 1;
					setRandomPosition(nextElement);
				} else if (randomPageButton) {
					randomPageButton.style.display = "block";
					randomPageButton.style.opacity = 1;
					setRandomPosition(randomPageButton);
				}
			}, 1000);
		});
	}

	// Initialize header elements with click handlers and random positions
	headers.forEach((header, index) => {
		const nextHeader = headers[index + 1];
		handleHeaderClick(header, nextHeader, randomPageButton);
		setRandomPosition(header);
		if (index !== 0) {
			header.style.display = "none";
		}
	});

	setRandomPosition(randomPageButton);
	randomPageButton.style.display = "none";

	// Handle random page button click
	randomPageButton.addEventListener("click", () => {
		const randomLink = navbarLinks[Math.floor(Math.random() * navbarLinks.length)];
		window.location.href = randomLink.href;
	});

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
			contentDiv.innerHTML = `<p>Content of ${page}</p>`;
		}, 1000);
	}
});
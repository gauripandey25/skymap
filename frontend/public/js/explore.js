async function fetchData(endpoint) {
    try {
        const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
        if (!token) {
            throw new Error('No authentication token found.');
        }
        const response = await fetch(`http://localhost:3000/explore/${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json' // Optional but recommended for API requests
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please log in.');
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint} data:`, error);
        return []; // Return empty array on error
    }
}

async function loadExploreSections() {
    try {
        const constellations = await fetchData('constellations');
        const planets = await fetchData('planets');
        const stars = await fetchData('stars');

        updateExploreSection('constellation-container', constellations, 'constellations');
        updateExploreSection('planet-container', planets, 'planets');
        updateExploreSection('star-container', stars, 'stars');
    } catch (error) {
        console.error('Error loading explore sections:', error);
    }
}

function updateExploreSection(containerId, items, category) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content
    console.log(`Updating ${category} section with items:`, items); // Log items being used

    const imageBase = {
        'constellations': 'constellation7.png',
        'planets': 'planet.png',
        'stars': 'stars.png'
    }[category];

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'card';

        const image = document.createElement('img');
        image.src = `images/${imageBase}`; // Use common image
        image.alt = item.name;

        const name = document.createElement('h3');
        name.textContent = item.name;

        const description = document.createElement('p');
        description.textContent = item.description;

        const moreInfoLink = document.createElement('a');
        moreInfoLink.href = `${item.name.toLowerCase().replace(/\s+/g, '')}.html`;
        moreInfoLink.className = 'expand-btn';
        moreInfoLink.textContent = 'More Info';

        itemElement.appendChild(image);
        itemElement.appendChild(name);
        itemElement.appendChild(description);
        itemElement.appendChild(moreInfoLink);

        container.appendChild(itemElement);
    });
}

function scrollContainer(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = container.clientWidth * 0.9; // Scroll by 90% of container width
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    loadExploreSections();

    // Initialize scroll buttons for each container
    document.querySelectorAll('.scroll-btn.left').forEach(button => {
        button.dataset.container = button.nextElementSibling.id; // Set data-container attribute
        button.addEventListener('click', () => scrollContainer(button.dataset.container, 'left'));
    });

    document.querySelectorAll('.scroll-btn.right').forEach(button => {
        button.dataset.container = button.previousElementSibling.id; // Set data-container attribute
        button.addEventListener('click', () => scrollContainer(button.dataset.container, 'right'));
    });
});

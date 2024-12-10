document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resultsDiv = document.getElementById('results');

    // Geolocation detection on focus
    searchInput.addEventListener('focus', () => {
        console.log("Search input focused, checking for geolocation...");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("Geolocation detected:", lat, lon);

                // Use OpenCage for reverse geocoding
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=a7a8d32625674d8f98f7fdcb073559e6`)
                    .then(response => response.json())
                    .then(data => {
                        console.log("Reverse geocoding data:", data);
                        // Construct a location string from OpenCage's response
                        const city = data.results[0]?.components.city || data.results[0]?.components.town || '';
                        const stateOrRegion = data.results[0]?.components.state || data.results[0]?.components.region || '';
                        searchInput.value = `${city}, ${stateOrRegion}`;
                    })
                    .catch(error => console.error('Error fetching location:', error));
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    // Search button click event listener
    searchButton.addEventListener('click', searchReserves);

    async function searchReserves() {
        const locationInput = searchInput.value.trim();

        // Check if the user provided input
        if (!locationInput) {
            alert('Please enter a location.');
            return;
        }

        // Show a loading message while the search is in progress
        resultsDiv.innerHTML = '<p>Loading results...</p>';

        // Get the token from sessionStorage
        const token = sessionStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            // Send the request with the Authorization header
            const response = await fetch(`https://skymap.onrender.com/darkskyroute/search?location=${encodeURIComponent(locationInput)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the header
                }
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data received:", data);

            displayResults(data);
        } catch (error) {
            console.error('Error fetching reserves:', error);
            alert('Failed to fetch dark sky reserves. Please try again later.');
            resultsDiv.innerHTML = ''; // Clear loading message
        }
    }

    function displayResults(data) {
        resultsDiv.innerHTML = ''; // Clear previous results

        const resultText = document.createElement('p');
        if (data.message) {
            resultText.innerText = data.message;
        } else if (data.length === 0) {
            resultText.innerText = 'No dark sky reserves found for this location.';
        } else {
            resultText.innerText = 'Dark sky reserves found:';
        }
        resultsDiv.appendChild(resultText);

        // Add space between text and results
        const spacer = document.createElement('div');
        spacer.style.height = '200px'; // Adjust the height to your preference
        resultsDiv.appendChild(spacer);

        // Display each result
        if (data.length > 0) {
            data.forEach(reserve => {
                const reserveDiv = document.createElement('div');
                reserveDiv.classList.add('reserve');

                const reserveName = document.createElement('h2');
                reserveName.innerText = reserve.name;

                const reserveLocation = document.createElement('p');
                reserveLocation.innerText = `Location: ${reserve.location}`;

                const reserveDescription = document.createElement('p');
                reserveDescription.innerText = reserve.description;

                reserveDiv.appendChild(reserveName);
                reserveDiv.appendChild(reserveLocation);
                reserveDiv.appendChild(reserveDescription);

                resultsDiv.appendChild(reserveDiv);
            });
        }
    }
});

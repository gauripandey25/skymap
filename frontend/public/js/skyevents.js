async function fetchData(endpoint) {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found.');
        }
        const response = await fetch(`https://skymap.onrender.com/api/events`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const eventsContainer = document.getElementById('events');

    try {
        const events = await fetchData('events');

        const currentDate = new Date();

        events
            .filter(event => new Date(event.date) >= currentDate)
            .forEach((event, index) => {
                const eventWrapper = document.createElement('div');
                eventWrapper.classList.add('event-wrapper');

                const eventElement = document.createElement('div');
                eventElement.classList.add('event');
                eventElement.classList.add(index % 2 === 0 ? 'left' : 'right');
                eventElement.innerHTML = `
                    <p class="event-date">${event.date}</p>
                    <p>${event.description}</p>
                `;

                const dot = document.createElement('div');
                dot.classList.add('dot');

                eventWrapper.appendChild(dot);
                eventWrapper.appendChild(eventElement);
                eventsContainer.appendChild(eventWrapper);

                setTimeout(() => {
                    eventElement.classList.add('visible');
                }, index * 100);
            });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
});



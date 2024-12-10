document.addEventListener('DOMContentLoaded', function() {
    // Automatically fill latitude and longitude with geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('latitude').value = position.coords.latitude;
            document.getElementById('longitude').value = position.coords.longitude;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    // Automatically fill date and time with current values
    function setCurrentDateTime() {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        document.getElementById('date').value = date;
        document.getElementById('time').value = time;
    }

    // Set the current date and time when the page loads
    setCurrentDateTime();

    // Handle form submission
    document.getElementById('custom-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally

        // Get values from the form
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        // Update Celestial JS
        Celestial.display({
            location: {
                lat: latitude,
                lon: longitude
            },
            date: date + 'T' + time,
            projection: "airy",
            datapath: "data/",
            planets: { show: true },
            constellations: { show: true },
            stars: { show: true }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Load the navbar HTML
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            // Insert the navbar HTML into the body
            document.body.insertAdjacentHTML('afterbegin', data);

            // Initialize logout functionality
            const logoutButton = document.getElementById('logoutbutton');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    // Remove the token and any other user data from sessionStorage
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('userData'); // Remove if you store user data

                    // Optionally, add a small visual cue here, like changing the button text
                    logoutButton.textContent = 'Logging out';

                    // Add fade-out effect before redirect
                    document.body.classList.add('fade-out');

                    // Redirect to the login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 800); // Adjust the delay as needed
                });
            }

            // Initialize Hamburger Menu functionality
            const hamburger = document.getElementById('hamburger');
            const navbutton = document.querySelector('.navbutton'); // Adjusted to select the nav button container

            if (hamburger && navbutton) {
                hamburger.addEventListener('click', function() {
                    navbutton.classList.toggle('active'); // Toggle the 'active' class to show/hide the menu
                });
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
});


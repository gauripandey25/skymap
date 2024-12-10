document.addEventListener('DOMContentLoaded', () => {
    // Load common navigation
    const navContainer = document.createElement('div');
    navContainer.classList.add('nav-container');
    document.body.appendChild(navContainer);

    fetch('explorenav.html')
        .then(response => response.text())
        .then(data => {
            navContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading the navigation:', error));
});



(function() {
    // Check if the user is logged in by checking the token in sessionStorage
    const token = sessionStorage.getItem('token');
    const currentPage = window.location.pathname;

    // If no token is found and the user is not on the login page, redirect to login
    if (!token && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
    }

    // If a token exists and the user is on the login page, redirect to the homepage
    if (token && currentPage.includes('index.html')) {
        window.location.href = 'homepage.html';
    }
})();
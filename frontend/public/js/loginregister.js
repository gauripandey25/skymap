const API_BASE_URL = 'https://skymap.onrender.com/api/users/'; // Note the trailing slash

function showLogin() {
    clearFormData('registerform');
    document.querySelector(".logincontainer").classList.add("active");
    document.querySelector(".logincontainer").classList.remove("inactive");
    document.querySelector(".registercontainer").classList.add("inactive");
    document.querySelector(".registercontainer").classList.remove("active");
    document.getElementById("loginbutton").classList.add("active");
    document.getElementById("registerbutton").classList.remove("active");
}

function showRegister() {
    clearFormData('loginform');
    document.querySelector(".registercontainer").classList.add("active");
    document.querySelector(".registercontainer").classList.remove("inactive");
    document.querySelector(".logincontainer").classList.add("inactive");
    document.querySelector(".logincontainer").classList.remove("active");
    document.getElementById("loginbutton").classList.remove("active");
    document.getElementById("registerbutton").classList.add("active");
}

function clearFormData(formId) {
    const formElement = document.getElementById(formId);
    if (formElement) {
        formElement.reset();
        clearErrorMessages();
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
}

function displayErrorMessage(formId, message) {
    const formElement = document.getElementById(formId);
    const errorElement = formElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.style.color = 'red';
        errorDiv.textContent = message;
        formElement.insertBefore(errorDiv, formElement.firstChild);
    }
}

function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(data => {
            const errorMessage = data.message || 'Something went wrong';
            throw new Error(errorMessage);
        });
    }
    return response.json();
}

function handleError(error, formId) {
    console.error('Error:', error);
    displayErrorMessage(formId, error.message);
}

// Validate password strength (for registration form)
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasDigit = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return 'Password must be at least 6 characters long.';
    }
    if (!hasUpperCase.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!hasDigit.test(password)) {
        return 'Password must contain at least one digit.';
    }
    if (!hasSpecialChar.test(password)) {
        return 'Password must contain at least one special character.';
    }
    return null;
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address.';
    }
    return null;
}

// Handle form submissions
// Register form submission handler
document.querySelector('#registerform').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.querySelector('#registerusername').value;
    const email = document.querySelector('#registeremail').value;
    const password = document.querySelector('#registerpassword').value;

    // Clear any previous error messages
    clearErrorMessages();

    // Client-side validation for email and password
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
        return displayErrorMessage('registerform', emailError);
    }
    if (passwordError) {
        return displayErrorMessage('registerform', passwordError);
    }

    // Send registration request to the backend
    fetch(`${API_BASE_URL}register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
    .then(handleResponse)
    .then(data => {
        console.log('Registration successful:', data);
        window.location.href = 'login.html';  // Redirect to login page after successful registration
    })
    .catch(error => handleError(error, 'registerform'));
});

// Login form submission handler
document.querySelector('#loginform').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.querySelector('#loginusername').value;
    const password = document.querySelector('#loginpassword').value;

    // Clear any previous error messages
    clearErrorMessages();

    // Send login request to the backend
    fetch(`${API_BASE_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(handleResponse)
    .then(data => {
        console.log('Login successful. User token:', data.token);
        sessionStorage.setItem('token', data.token);  // Store the token in session storage

        // Redirect to the homepage
        window.location.href = 'homepage.html';
    })
    .catch(error => handleError(error, 'loginform'));
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
});

const loginBtn = document.getElementById('login-btn');
loginBtn.onclick = function () {
    const usernameInput = document.querySelector('#username-input');
    const passwordInput = document.querySelector('#password-input');
    const username = usernameInput.value;
    const password = passwordInput.value;
    usernameInput.value = "";
    passwordInput.value = "";

    fetch('http://localhost:5000/login', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the main application page upon successful login
            window.location.href = '/index.html'; // Adjust the path as necessary
        } else {
            // Handle login failure (e.g., show an error message)
            alert('Invalid credentials. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
const fs = require('fs');
const path = require('path');

document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Get the message box element
    const messageBox = document.getElementById('messageBox');

    // Ensure fields are filled
    if (!username || !password) {
        messageBox.textContent = 'Username and Password are required!';
        return;
    }

    // Path to the CSV file
    const filePath = path.join(__dirname, '.', 'data', 'user.csv');

    // Read the CSV file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            messageBox.textContent = 'An error occurred. Please try again.';
            return;
        }

        // Parse the CSV content
        const rows = data.split('\n').filter((row) => row.trim() !== '');
        const userFound = rows.some((row) => {
            const [csvUsername, csvPassword] = row.split(',');
            return csvUsername === username && csvPassword === password;
        });

        if (userFound) {
            messageBox.style.color = 'green';
            messageBox.textContent = 'Login successful!';
            // Redirect or perform login actions
            setTimeout(() => {
                window.location.href = 'reservation_Menu.html'; // Example: Redirect to a dashboard page
            }, 2000);
        } else {
            messageBox.textContent = 'Invalid username or password.';
        }
    });
});

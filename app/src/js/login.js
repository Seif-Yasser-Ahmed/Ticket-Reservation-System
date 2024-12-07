const fs = require('fs');
const path = require('path');

document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const messageBox = document.getElementById('messageBox');

    if (!username || !password) {
        messageBox.textContent = 'Username and Password are required!';
        return;
    }

    const filePath = path.join(__dirname, '.', 'data', 'user.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            messageBox.textContent = 'An error occurred. Please try again.';
            return;
        }

        const rows = data.split('\n').filter((row) => row.trim() !== '');
        const userFound = rows.some((row) => {
            const [csvUsername, csvPassword] = row.split(',');
            return csvUsername === username && csvPassword === password;
        });

        if (userFound) {
            messageBox.style.color = 'green';
            messageBox.textContent = 'Login successful!';
            setTimeout(() => {
                window.location.href = 'reservation_Menu.html';
            }, 500);
        } else {
            messageBox.textContent = 'Invalid username or password.';
        }
    });
});

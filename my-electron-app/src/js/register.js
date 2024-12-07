const fs = require('fs');
const path = require('path');

document.getElementById('registerButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const country = document.getElementById('country').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Get the message box element
    const messageBox = document.getElementById('messageBox');

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email format
    const phoneRegex = /^[0-9]{10,}$/; // At least 10 digits, numeric only

    // Validate inputs
    if (!username || !email || !phoneNumber || !country || !password) {
        messageBox.textContent = 'All fields are required!';
        return;
    }

    if (!emailRegex.test(email)) {
        messageBox.textContent = 'Please enter a valid email address!';
        return;
    }

    if (!phoneRegex.test(phoneNumber)) {
        messageBox.textContent = 'Phone number must be at least 10 digits and contain only numbers!';
        return;
    }

    if (password.length < 4) {
        messageBox.textContent = 'Password must be at least 4 characters long!';
        return;
    }

    if (password !== confirmPassword) {
        messageBox.textContent = 'Passwords do not match!';
        return;
    }

    // Path to the CSV file
    const filePath = path.join(__dirname, '.', 'data', 'user.csv');

    // Read the CSV file to check for duplicate username
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            messageBox.textContent = 'An error occurred. Please try again.';
            return;
        }

        // Check if username already exists
        if (data) {
            const rows = data.split('\n');
            const userExists = rows.some((row) => {
                const [existingUsername] = row.split(',');
                return existingUsername === username;
            });

            if (userExists) {
                messageBox.textContent = 'Username already exists. Please choose another one.';
                return;
            }
        }

        // Create CSV row
        const csvRow = `${username},${password},${email},${phoneNumber},${country}\n`;

        // Ensure a newline if the file doesn't already end with one
        const contentToWrite = data && !data.endsWith('\n') ? `\n${csvRow}` : csvRow;

        // Append to the CSV file
        fs.appendFile(filePath, contentToWrite, (err) => {
            if (err) {
                console.error('Error saving user:', err);
                messageBox.textContent = 'Failed to register. Please try again.';
            } else {
                messageBox.style.color = 'green';
                messageBox.textContent = 'Registration successful!';
                clearForm(); // Clear the form after successful registration

                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    });
});

// Function to clear the form
function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('country').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
}

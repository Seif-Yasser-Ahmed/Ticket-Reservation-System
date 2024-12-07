const fs = require('fs');
const path = require('path');

document.getElementById('registerButton').addEventListener('click', (event) => {
    event.preventDefault();
    const pickup = document.getElementById('pickup').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;

    const messageBox = document.getElementById('messageBox');

    if (!pickup || !destination || !tickets) {
        messageBox.textContent = 'All fields are required!';
        return;
    }


    const filePath = path.join(__dirname, '.', 'data', 'TrainReservation.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            messageBox.textContent = 'An error occurred. Please try again.';
            return;
        }

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
        const PassengerName = 'testUser';
        const PassengerNumber = '0100000';
        // const testCountry = 'TestCountry';
        const csvRow = `${PassengerName},${PassengerNumber},${pickup},${destination},${tickets}\n`;

        const contentToWrite = data && !data.endsWith('\n') ? `\n${csvRow}` : csvRow;

        fs.appendFile(filePath, contentToWrite, (err) => {
            if (err) {
                console.error('Error saving user:', err);
                messageBox.textContent = 'Failed to register. Please try again.';
            } else {
                messageBox.style.color = 'green';
                messageBox.textContent = 'Registration successful!';
                clearForm();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 500);
            }
        });
    });
});

function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('country').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
}
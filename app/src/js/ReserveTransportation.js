const fs = require('fs');
const path = require('path');

const appState = {
    data: {},
    user: null,
};

function loadAppState(type) {
    const userData = fs.readFileSync(path.join(__dirname, '.', 'data', 'user_data.json'));
    const userInfo = JSON.parse(userData);

    appState.user = {
        username: userInfo.split(',')[0],
        phoneNumber: userInfo.split(',')[3],
    };

    const filePath = path.join(__dirname, '.', 'data', `${type}.csv`);
    appState.data[type] = fs.readFileSync(filePath, 'utf8').split('\n');
}

function updateTransportFile(type, updatedData) {
    fs.writeFileSync(path.join(__dirname, '.', 'data', `${type}.csv`), updatedData.join('\n'));
}

function writeReservation(type, reservationData) {
    const filePath = path.join(__dirname, '.', 'data', `${type}Reservation.csv`);
    fs.appendFile(filePath, reservationData, (err) => {
        if (err) {
            console.error(`Error saving reservation for ${type}:`, err);
            displayMessage(`Failed to reserve. Please try again for ${type}.`, 'red');
        } else {
            displayMessage(`${type} reservation successful!`, 'green');
            clearForm();
        }
    });
}

function displayMessage(message, color) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.style.color = color;
}

function validateBookingForm({ pickup, destination, tickets, number, date }, type) {
    if (!pickup || !destination || !tickets || !number || !date) {
        displayMessage(`All fields are required for ${type}!`, 'red');
        return false;
    }
    if (tickets < 1) {
        displayMessage(`Number of tickets must be at least 1 for ${type}!`, 'red');
        return false;
    }
    return true;
}

function handleRegisterClick(event) {
    event.preventDefault();

    const pickup = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = parseInt(document.getElementById('tickets').value, 10);
    const number = document.getElementById(`${type}`).value;
    const date = document.getElementById('pickupdate').value;

    if (!validateBookingForm({ pickup, destination, tickets, number, date }, type)) {
        return;
    }

    const data = appState.data[type];
    const index = data.findIndex((line) => line.split(',')[0] === number);

    if (index !== -1) {
        const transportData = data[index].split(',');
        if (parseInt(transportData[5], 10) < tickets) {
            displayMessage(`Not enough tickets available for ${type}!`, 'red');
            return;
        }
        transportData[5] = parseInt(transportData[5], 10) - tickets;
        data[index] = transportData.join(',');

        updateTransportFile(type, data);

        const csvRow = `${appState.user.username},${appState.user.phoneNumber},${number},${pickup},${destination},${tickets},${date}\n`;
        writeReservation(type, csvRow);
    }
}

function handleSearchClick(event) {
    event.preventDefault();

    const departure = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();

    if (!departure || !destination) {
        displayMessage(`Departure and Destination are required for ${type}!`, 'red');
        return;
    }

    const availableOptions = appState.data[type].filter((line) => {
        const columns = line.split(',');
        return columns[1] === departure && columns[2] === destination;
    });

    populateTransportSelector(type, availableOptions);
}

function populateTransportSelector(type, options) {
    const selector = document.getElementById(`${type}`);
    const selectionDiv = document.getElementById(`${type}Selection`);
    selector.innerHTML = '';
    selectionDiv.style.display = 'none';

    if (options.length > 0) {
        options.forEach((option) => {
            const [number, departure, destination, departureTime, price, seats] = option.split(',');

            const optionElement = document.createElement('option');
            optionElement.value = number;
            optionElement.textContent = `${number} - ${departure} to ${destination} - at ${departureTime} - Price: $${price} | Remaining Seats: ${seats}`;

            selector.appendChild(optionElement);
        });

        selectionDiv.style.display = 'block';
        displayMessage(`${type} options available!`, 'green');
    } else {
        displayMessage(`No ${type} available for the selected route.`, 'red');
    }
}

function clearForm() {
    document.getElementById('departure').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('tickets').value = '';
    document.getElementById('pickupdate').value = '';
    document.getElementById(`${type}Selection`).style.display = 'none';
}

type = document.getElementById('type').innerHTML.split(' ')[1];

document.getElementById(`registerButton${type}`).addEventListener('click', handleRegisterClick);
document.getElementById(`search${type}`).addEventListener('click', handleSearchClick);


loadAppState(type);



function loadAllUserReservations() {
    const reservationTypes = ['Bus', 'Train', 'Plane']; // Add other types if needed
    const historyTableBody = document.getElementById('historyTableBody');
    historyTableBody.innerHTML = '';

    reservationTypes.forEach((reservationType) => {
        const reservationFilePath = path.join(__dirname, '.', 'data', `${reservationType}Reservation.csv`);
        if (fs.existsSync(reservationFilePath)) {
            const reservations = fs.readFileSync(reservationFilePath, 'utf8').split('\n').filter(line => line);
            const userReservations = reservations.filter(reservation => reservation.split(',')[0] === appState.user.username);

            userReservations.forEach(reservation => {
                const [username, phoneNumber, number, pickup, destination, tickets, date] = reservation.split(',');
                // PassengerName,PassengerNumber,BusID,Source,Destination,Tickets,Date
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reservationType}</td>
                    <td>${number}</td>
                    <td>${pickup}</td>
                    <td>${destination}</td>
                    <td>${date}</td>
                    <td>${tickets}</td>
                `;
                historyTableBody.appendChild(row);
            });
        }
    });
}

// loadAllUserReservations();

// loadUserReservations();
const fs = require('fs');
const path = require('path');

document.getElementById('registerButton').addEventListener('click', (event) => {
    event.preventDefault();
    const pickup = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;
    const train_number = document.getElementById('train').value;
    const pickupdate = document.getElementById('pickupdate').value;


    const messageBox = document.getElementById('messageBox');

    if (!pickup || !destination || !tickets || !train_number || !pickupdate) {
        messageBox.textContent = 'All fields are required!';
        messageBox.style.color = 'red';
        return;
    }

    if (tickets < 1) {
        messageBox.textContent = 'Number of tickets must be at least 1!';
        messageBox.style.color = 'red';
        return;
    }

    trains_file = fs.readFileSync(path.join(__dirname, '.', 'data', 'trains.csv'), 'utf8').split('\n');
    for (let i = 1; i < trains_file.length; i++) {
        const columns = trains_file[i].split(',');
        if (columns[0] === train_number) {
            if (parseInt(columns[5]) < tickets) {
                messageBox.textContent = 'Not enough tickets available!';
                return;
            }
            columns[5] = parseInt(columns[5]) - tickets;
            trains_file[i] = columns.join(',');
            break;
        }
    }



    const filePath = path.join(__dirname, '.', 'data', 'TrainReservation.csv');

    const user_data = fs.readFileSync(path.join(__dirname, '.', 'data', 'user_data.json'));
    const user_data_json = JSON.parse(user_data);
    const username = user_data_json.split(',')[0];
    const phoneNumber = user_data_json.split(',')[3];

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            messageBox.textContent = 'An error occurred. Please try again.';
            return;
        }

        if (data) {
            const rows = data.split('\n');
            const userExists = rows.some((row) => {
                const values = row.split(',');
                existingUsername = values[0];
                existingDate = values[6];

                return (existingUsername === username && existingDate === pickupdate);
            });

            if (userExists) {
                messageBox.textContent = "You can't book multiple trains at the same time";
                messageBox.style.color = 'red';
                return;
            }
        }

        fs.writeFileSync(path.join(__dirname, '.', 'data', 'trains.csv'), trains_file.join('\n'));

        const PassengerName = username;
        const PassengerNumber = phoneNumber;
        const csvRow = `${PassengerName},${PassengerNumber},${train_number},${pickup},${destination},${tickets},${pickupdate}\n`;

        const contentToWrite = data && !data.endsWith('\n') ? `\n${csvRow}` : csvRow;

        fs.appendFile(filePath, contentToWrite, (err) => {
            if (err) {
                console.error('Error saving user:', err);
                messageBox.textContent = 'Failed to register. Please try again.';
            } else {
                messageBox.style.color = 'green';
                messageBox.textContent = 'Registration successful!';
                clearForm();
            }
        });
    });
});

document.getElementById('searchTrains').addEventListener('click', (event) => {
    event.preventDefault();
    const departure = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;

    const messageBox = document.getElementById('messageBox');

    let train_data = fs.readFileSync(path.join(__dirname, '.', 'data', 'trains.csv'), 'utf8').split('\n');

    let availableTrains = [];

    if (!departure || !destination) {
        messageBox.textContent = 'Departure and Destination are required!';
        return;
    }

    for (let i = 1; i < train_data.length; i++) {
        const columns = train_data[i].split(',');
        csvDeparture = columns[1];
        csvDestination = columns[2];
        if (csvDeparture === departure && csvDestination === destination) {
            availableTrains.push(train_data[i]);
        }
    }


    const trainselector = document.getElementById('train');
    const trainSelectionDiv = document.getElementById('trainSelection');


    trainselector.innerHTML = '';
    trainSelectionDiv.style.display = 'none';

    if (Array.isArray(availableTrains) && availableTrains.length > 0) {
        availableTrains.forEach((train) => {
            const [trainNumber, departure, destination, departureTime, price, seats] = train.split(',');

            const trainOption = document.createElement('option');
            trainOption.value = trainNumber;
            trainOption.textContent = `${trainNumber} - ${departure} to ${destination} - at ${departureTime} - Price: $${price} | Remaining Seats: ${seats}`;

            trainselector.appendChild(trainOption);
        });

        trainSelectionDiv.style.display = 'block';
        messageBox.textContent = 'Trains available!';
        messageBox.style.color = 'green';
    } else {
        messageBox.textContent = 'No trains available for the selected route.';
        messageBox.style.color = 'red';
    }
});

function clearForm() {
    document.getElementById('departure').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('tickets').value = '';
    document.getElementById('pickupdate').value = '';
    // messageBox.style.display = 'none';
    document.getElementById('trainSelection').style.display = 'None';
}
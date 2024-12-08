const fs = require('fs');
const path = require('path');

document.getElementById('registerButton').addEventListener('click', (event) => {
    event.preventDefault();
    const pickup = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;
    const Bus_number = document.getElementById('Bus').value;
    const pickupdate = document.getElementById('pickupdate').value;


    const messageBox = document.getElementById('messageBox');

    if (!pickup || !destination || !tickets || !Bus_number || !pickupdate) {
        messageBox.textContent = 'All fields are required!';
        messageBox.style.color = 'red';
        return;
    }

    if (tickets < 1) {
        messageBox.textContent = 'Number of tickets must be at least 1!';
        messageBox.style.color = 'red';
        return;
    }

    Buss_file = fs.readFileSync(path.join(__dirname, '.', 'data', 'Buss.csv'), 'utf8').split('\n');
    for (let i = 1; i < Buss_file.length; i++) {
        const columns = Buss_file[i].split(',');
        if (columns[0] === Bus_number) {
            if (parseInt(columns[5]) < tickets) {
                messageBox.textContent = 'Not enough tickets available!';
                return;
            }
            columns[5] = parseInt(columns[5]) - tickets;
            Buss_file[i] = columns.join(',');
            break;
        }
    }



    const filePath = path.join(__dirname, '.', 'data', 'BusReservation.csv');

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
                // console.log(typeof pickupdate);
                // console.log(typeof existingDate);
                return (existingUsername === username && existingDate === pickupdate);
            });

            if (userExists) {
                messageBox.textContent = "You can't book multiple Buss at the same time";
                messageBox.style.color = 'red';
                return;
            }
        }

        fs.writeFileSync(path.join(__dirname, '.', 'data', 'Buss.csv'), Buss_file.join('\n'));

        const PassengerName = username;
        const PassengerNumber = phoneNumber;
        const csvRow = `${PassengerName},${PassengerNumber},${Bus_number},${pickup},${destination},${tickets},${pickupdate}\n`;

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

document.getElementById('searchBuss').addEventListener('click', (event) => {
    event.preventDefault();
    const departure = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;

    const messageBox = document.getElementById('messageBox');

    let Bus_data = fs.readFileSync(path.join(__dirname, '.', 'data', 'Buss.csv'), 'utf8').split('\n');

    let availableBuss = [];

    if (!departure || !destination) {
        messageBox.textContent = 'Departure and Destination are required!';
        return;
    }
    for (let i = 1; i < Bus_data.length; i++) {
        const columns = Bus_data[i].split(',');
        csvDeparture = columns[1];
        csvDestination = columns[2];
        if (csvDeparture === departure && csvDestination === destination) {
            availableBuss.push(Bus_data[i]);
        }
    }
    const Busselector = document.getElementById('Bus');
    const BusSelectionDiv = document.getElementById('BusSelection');

    Busselector.innerHTML = '';
    BusSelectionDiv.style.display = 'none';

    if (Array.isArray(availableBuss) && availableBuss.length > 0) {
        availableBuss.forEach((Bus) => {
            const [BusNumber, departure, destination, departureTime, price, seats] = Bus.split(',');

            const BusOption = document.createElement('option');
            BusOption.value = BusNumber;
            BusOption.textContent = `${BusNumber} - ${departure} to ${destination} - at ${departureTime} - Price: $${price} | Remaining Seats: ${seats}`;

            Busselector.appendChild(BusOption);
        });

        BusSelectionDiv.style.display = 'block';

        messageBox.textContent = 'Buss available!';
        messageBox.style.color = 'green';
    } else {
        messageBox.textContent = 'No Buss available for the selected route.';
        messageBox.style.color = 'red';
    }
});

function clearForm() {
    document.getElementById('departure').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('tickets').value = '';
    document.getElementById('pickupdate').value = '';
    // document.getElementById('BusSelection').value = '';
    document.getElementById('BusSelection').style.display = 'None';

}
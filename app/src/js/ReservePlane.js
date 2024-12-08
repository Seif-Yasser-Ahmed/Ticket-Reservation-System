const fs = require('fs');
const path = require('path');

document.getElementById('registerButton').addEventListener('click', (event) => {
    event.preventDefault();
    const pickup = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;
    const Plane_number = document.getElementById('Plane').value;
    const pickupdate = document.getElementById('pickupdate').value;


    const messageBox = document.getElementById('messageBox');

    if (!pickup || !destination || !tickets || !Plane_number || !pickupdate) {
        messageBox.textContent = 'All fields are required!';
        messageBox.style.color = 'red';
        return;
    }

    if (tickets < 1) {
        messageBox.textContent = 'Number of tickets must be at least 1!';
        messageBox.style.color = 'red';
        return;
    }

    Planes_file = fs.readFileSync(path.join(__dirname, '.', 'data', 'Planes.csv'), 'utf8').split('\n');
    for (let i = 1; i < Planes_file.length; i++) {
        const columns = Planes_file[i].split(',');
        if (columns[0] === Plane_number) {
            if (parseInt(columns[5]) < tickets) {
                messageBox.textContent = 'Not enough tickets available!';
                return;
            }
            columns[5] = parseInt(columns[5]) - tickets;
            Planes_file[i] = columns.join(',');
            break;
        }
    }



    const filePath = path.join(__dirname, '.', 'data', 'FlightsReservation.csv');

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
                messageBox.textContent = "You can't book multiple Planes at the same time";
                messageBox.style.color = 'red';
                return;
            }
        }

        fs.writeFileSync(path.join(__dirname, '.', 'data', 'Planes.csv'), Planes_file.join('\n'));

        const PassengerName = username;
        const PassengerNumber = phoneNumber;
        const csvRow = `${PassengerName},${PassengerNumber},${Plane_number},${pickup},${destination},${tickets},${pickupdate}\n`;

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

document.getElementById('searchPlanes').addEventListener('click', (event) => {
    event.preventDefault();
    const departure = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const tickets = document.getElementById('tickets').value;

    const messageBox = document.getElementById('messageBox');

    let Plane_data = fs.readFileSync(path.join(__dirname, '.', 'data', 'Planes.csv'), 'utf8').split('\n');

    let availablePlanes = [];

    if (!departure || !destination) {
        messageBox.textContent = 'Departure and Destination are required!';
        return;
    }

    for (let i = 1; i < Plane_data.length; i++) {
        const columns = Plane_data[i].split(',');
        csvDeparture = columns[1];
        csvDestination = columns[2];
        if (csvDeparture === departure && csvDestination === destination) {
            availablePlanes.push(Plane_data[i]);
        }
    }


    const Planeselector = document.getElementById('Plane');
    const PlaneSelectionDiv = document.getElementById('PlaneSelection');


    Planeselector.innerHTML = '';
    PlaneSelectionDiv.style.display = 'none';

    if (Array.isArray(availablePlanes) && availablePlanes.length > 0) {
        availablePlanes.forEach((Plane) => {
            const [PlaneNumber, departure, destination, departureTime, price, seats] = Plane.split(',');

            const PlaneOption = document.createElement('option');
            PlaneOption.value = PlaneNumber;
            PlaneOption.textContent = `${PlaneNumber} - ${departure} to ${destination} - at ${departureTime} - Price: $${price} | Remaining Seats: ${seats}`;

            Planeselector.appendChild(PlaneOption);
        });

        PlaneSelectionDiv.style.display = 'block';
        messageBox.textContent = 'Planes available!';
        messageBox.style.color = 'green';
    } else {
        messageBox.textContent = 'No Planes available for the selected route.';
        messageBox.style.color = 'red';
    }
});

function clearForm() {
    document.getElementById('departure').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('tickets').value = '';
    document.getElementById('pickupdate').value = '';
    // messageBox.style.display = 'none';
    document.getElementById('PlaneSelection').style.display = 'None';
}
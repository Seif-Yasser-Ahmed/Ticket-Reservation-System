const fs = require('fs');
const path = require('path');

const appState = {
    data: {},
    user: null,
};

function loadAppState() {
    const userData = fs.readFileSync(path.join(__dirname, '.', 'data', 'user_data.json'));
    const userInfo = JSON.parse(userData);

    appState.user = {
        username: userInfo.split(',')[0],
        phoneNumber: userInfo.split(',')[3],
    };

    // const filePath = path.join(__dirname, '.', 'data', `${type}.csv`);
    // appState.data[type] = fs.readFileSync(filePath, 'utf8').split('\n');
}

function loadAllUserReservations() {
    const reservationTypes = ['Bus', 'Train', 'Plane']; // Add other types if needed
    const historyTableBody = document.getElementById('historyTableBody');
    historyTableBody.innerHTML = '';

    reservationTypes.forEach((reservationType) => {
        const reservationFilePath = 'Src/data/' + `${reservationType}Reservation.csv`;
        console.log(reservationFilePath);
        if (fs.existsSync(reservationFilePath)) {
            const reservations = fs.readFileSync(reservationFilePath, 'utf8').split('\n').filter(line => line);
            const userReservations = reservations.filter(reservation => reservation.split(',')[0] === appState.user.username);

            userReservations.forEach(reservation => {
                const [username, phoneNumber, number, pickup, destination, tickets, date] = reservation.split(',');
                // PassengerName,PassengerNumber,BusID,Source,Destination,Tickets,Date
                const row = document.createElement('tr');
                row.style.border = '1px solid #ffc600';
                row.innerHTML = `
                  <td style=" border-bottom: 1px solid ">${reservationType}</td>

                <td style=" border-bottom: 1px solid ">${number}</td>

                 <td style=" border-bottom: 1px solid ">${pickup}</td>

                  <td style=" border-bottom: 1px solid ">${destination}</td>

                   <td style=" border-bottom: 1px solid ">${date}</td>

                <td style=" border-bottom: 1px solid ">${tickets}</td>
        `;
                historyTableBody.appendChild(row);
            });
        }
    });
}

loadAppState()
loadAllUserReservations()
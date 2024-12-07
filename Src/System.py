import tkinter as tk
from tkinter import messagebox


class TicketReservationSystem:
    def __init__(self, max_seats=10, ticket_type="Generic", route=None):
        self.ticket_type = ticket_type
        self.route = route
        self.states = ['Start', 'SeatsAvailable', 'SeatReserved',
                       'SeatUnavailable', 'ReservationCancelled', 'MaxSeatsReached', 'End']
        self.current_state = self.states[0]  # Start state
        self.total_seats = max_seats
        self.reserved_seats = 0
        self.max_seats = max_seats

    def check_availability(self):
        return self.reserved_seats < self.max_seats

    def reserve_seat(self):
        if self.check_availability():
            self.reserved_seats += 1
            if self.reserved_seats == self.max_seats:
                self.update_state('MaxSeatsReached')
            else:
                self.update_state('SeatReserved')
        else:
            self.update_state('SeatUnavailable')

    def cancel_reservation(self):
        if self.reserved_seats > 0:
            self.reserved_seats -= 1
            self.update_state('ReservationCancelled')
        else:
            messagebox.showwarning(
                "No Reservation", "There are no reservations to cancel.")

    def update_state(self, new_state):
        if new_state in self.states:
            self.current_state = new_state

    def get_status(self):
        return f"{self.ticket_type} Reservation\n" \
            f"Route: {self.route if self.route else 'Not Selected'}\n" \
            f"Total Seats: {self.total_seats}\n" \
            f"Reserved Seats: {self.reserved_seats}\n" \
            f"Available Seats: {self.total_seats - self.reserved_seats}"

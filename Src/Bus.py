import tkinter as tk
from tkinter import messagebox


class BusSelectionPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.ticket_system = None  # Initially, no ticket system

        # Bus Route Selection Widgets
        self.title_label = tk.Label(
            self, text="Select Bus Route", font=("Arial", 14))
        self.title_label.grid(row=0, column=0, columnspan=2, pady=20)

        self.route_label = tk.Label(
            self, text="Choose route:", font=("Arial", 12))
        self.route_label.grid(row=1, column=0, pady=10, sticky="e")

        self.route_choice = tk.StringVar()
        self.route_menu = tk.OptionMenu(self, self.route_choice,
                                        "City A to City B", "City B to City C", "City C to City D")
        self.route_menu.grid(row=1, column=1, pady=10)

        self.confirm_button = tk.Button(
            self, text="Select Route and Continue", width=20, command=self.select_route)
        self.confirm_button.grid(row=2, column=0, columnspan=2, pady=20)

        self.back_button = tk.Button(
            self, text="Back", width=20, command=lambda: self.controller.show_frame("MainMenuPage"))
        self.back_button.grid(row=3, column=0, columnspan=2, pady=20)

    def select_route(self):
        selected_route = self.route_choice.get()
        if selected_route:
            # Set the route and define the seats for each route
            if selected_route == "City A to City B":
                self.ticket_system = TicketReservationSystem(
                    ticket_type="Bus", route=selected_route, max_seats=30)
            elif selected_route == "City B to City C":
                self.ticket_system = TicketReservationSystem(
                    ticket_type="Bus", route=selected_route, max_seats=40)
            elif selected_route == "City C to City D":
                self.ticket_system = TicketReservationSystem(
                    ticket_type="Bus", route=selected_route, max_seats=25)
            print(selected_route)
            # Proceed to the reservation page
            self.controller.show_frame("BusReservationPage")
        else:
            messagebox.showwarning("No Route", "Please select a route.")


class BusReservationPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        # Reservation Widgets
        self.status_label = tk.Label(
            self, text="No route selected", font=("Arial", 14), width=40, height=5)
        self.status_label.grid(
            row=0, column=0, columnspan=3, pady=10, sticky="nsew")

        self.reserve_button = tk.Button(
            self, text="Reserve Seat", width=20, command=self.reserve_seat)
        self.reserve_button.grid(row=1, column=0, pady=5, sticky="nsew")

        self.cancel_button = tk.Button(
            self, text="Cancel Reservation", width=20, command=self.cancel_seat)
        self.cancel_button.grid(row=1, column=1, pady=5, sticky="nsew")

        self.back_button = tk.Button(
            self, text="Back", width=20, command=lambda: self.controller.show_frame("BusSelectionPage"))
        self.back_button.grid(
            row=2, column=0, columnspan=3, pady=10, sticky="nsew")

        # Initialize ticket system when entering this page
        self.ticket_system = None  # Initially, no ticket system

    def set_ticket_system(self, ticket_system):
        """Set ticket_system dynamically"""
        self.ticket_system = ticket_system
        self.update_status()

    def update_status(self):
        if self.ticket_system:
            self.status_label.config(text=self.ticket_system.get_status())
        else:
            self.status_label.config(text="No ticket system available")

    def reserve_seat(self):
        if self.ticket_system and self.ticket_system.check_availability():
            self.ticket_system.reserve_seat()
            self.update_status()
            if self.ticket_system.current_state == 'SeatReserved':
                messagebox.showinfo(
                    "Reservation", "Seat reserved successfully!")
            elif self.ticket_system.current_state == 'MaxSeatsReached':
                messagebox.showinfo("Max Seats", "All seats are reserved!")
        else:
            messagebox.showwarning(
                "Unavailable", "No seats available for reservation!")

    def cancel_seat(self):
        if self.ticket_system:
            self.ticket_system.cancel_reservation()
            self.update_status()
            if self.ticket_system.current_state == 'ReservationCancelled':
                messagebox.showinfo(
                    "Cancellation", "Reservation cancelled successfully!")
            else:
                messagebox.showwarning(
                    "No Reservation", "There are no reservations to cancel.")

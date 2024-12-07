import tkinter as tk
from tkinter import messagebox


class MainMenuPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        # Main Menu Widgets
        self.title_label = tk.Label(
            self, text="Choose Ticket Reservation Type", font=("Arial", 14))
        self.title_label.grid(row=0, column=0, columnspan=2, pady=20)

        self.bus_button = tk.Button(self, text="Bus Ticket Reservation", width=20,
                                    command=lambda: self.controller.show_frame("BusSelectionPage"))
        self.bus_button.grid(row=1, column=0, pady=10)

        self.airplane_button = tk.Button(self, text="Airplane Ticket Reservation",
                                         width=20, command=lambda: self.controller.show_frame("AirplaneSelectionPage"))
        self.airplane_button.grid(row=2, column=0, pady=10)

        self.train_button = tk.Button(self, text="Train Ticket Reservation", width=20,
                                      command=lambda: self.controller.show_frame("TrainSelectionPage"))
        self.train_button.grid(row=3, column=0, pady=10)

        self.logout_button = tk.Button(
            self, text="Logout", width=20, command=lambda: self.controller.show_frame("LoginPage"))
        self.logout_button.grid(row=4, column=0, pady=10)

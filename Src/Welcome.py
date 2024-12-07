import tkinter as tk
from tkinter import messagebox


class WelcomePage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        # Welcome Page Widgets
        self.title_label = tk.Label(
            self, text="Welcome to Transportation Reservation System", font=("Arial", 16))
        self.title_label.grid(row=0, column=0, columnspan=2, pady=20)

        self.welcome_message = tk.Label(
            self, text="Please login to continue", font=("Arial", 12))
        self.welcome_message.grid(row=1, column=0, columnspan=2, pady=20)

        self.continue_button = tk.Button(
            self, text="Continue to Login", width=20, command=lambda: self.controller.show_frame("LoginPage"))
        self.continue_button.grid(row=2, column=0, columnspan=2, pady=20)

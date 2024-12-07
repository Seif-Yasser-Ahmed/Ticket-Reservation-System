import tkinter as tk
from tkinter import messagebox
import pandas as pd


class LoginPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        # Configure grid to center elements
        self.grid_rowconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        self.grid_rowconfigure(2, weight=1)
        self.grid_rowconfigure(3, weight=1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        # Login Page Widgets
        self.username_label = tk.Label(
            self, text="Username:", font=("Arial", 12))
        self.username_label.grid(row=1, column=0, pady=10, sticky="e")
        self.username_entry = tk.Entry(self, font=("Arial", 12))
        self.username_entry.grid(row=1, column=1, pady=10)

        self.password_label = tk.Label(
            self, text="Password:", font=("Arial", 12))
        self.password_label.grid(row=2, column=0, pady=10, sticky="e")
        self.password_entry = tk.Entry(self, font=("Arial", 12), show="*")
        self.password_entry.grid(row=2, column=1, pady=10)

        self.login_button = tk.Button(
            self, text="Login", width=20, command=self.login)
        self.login_button.grid(row=3, column=0, columnspan=2, pady=10)

    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()

        # Load the Excel file
        df = pd.read_csv('Utils/database.csv')

        if not df[(df['Name'] == username) & ((df['Password']) == password)].empty:
            self.controller.show_frame("MainMenuPage")
        else:
            messagebox.showerror(
                "Login Failed", "Incorrect username or password.")
            self.register_button = tk.Button(
                self, text="Register", width=20, command=lambda: self.controller.show_frame("SignupPage"))
            self.register_button.grid(row=4, column=0, columnspan=2, pady=10)

    def go_to_signup(self):
        self.controller.show_frame("SignupPage")

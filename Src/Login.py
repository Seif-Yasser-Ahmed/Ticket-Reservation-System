import tkinter as tk
from tkinter import messagebox


class LoginPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        # Login Page Widgets
        self.username_label = tk.Label(
            self, text="Username:", font=("Arial", 12))
        self.username_label.grid(row=0, column=0, pady=10, sticky="e")
        self.username_entry = tk.Entry(self, font=("Arial", 12))
        self.username_entry.grid(row=0, column=1, pady=10)

        self.password_label = tk.Label(
            self, text="Password:", font=("Arial", 12))
        self.password_label.grid(row=1, column=0, pady=10, sticky="e")
        self.password_entry = tk.Entry(self, font=("Arial", 12), show="*")
        self.password_entry.grid(row=1, column=1, pady=10)

        self.login_button = tk.Button(
            self, text="Login", width=20, command=self.login)
        self.login_button.grid(row=2, column=0, columnspan=2, pady=10)

    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()

        if username == "user" and password == "password":
            self.controller.show_frame("MainMenuPage")
        else:
            messagebox.showerror(
                "Login Failed", "Incorrect username or password.")

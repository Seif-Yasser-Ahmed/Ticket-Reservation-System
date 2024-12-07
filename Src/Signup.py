import tkinter as tk
from tkinter import messagebox
from tkcalendar import DateEntry
import csv
import os


class SignupPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.parent = parent
        self.create_widgets()

    def create_widgets(self):
        for i in range(6):
            self.grid_rowconfigure(i, weight=1)
        for i in range(2):
            self.grid_columnconfigure(i, weight=1)

        tk.Label(self, text="Username").grid(row=0, column=0, sticky="e")
        self.entry_username = tk.Entry(self)
        self.entry_username.grid(row=0, column=1, sticky="w")

        tk.Label(self, text="Password").grid(row=1, column=0, sticky="e")
        self.entry_password = tk.Entry(self, show="*")
        self.entry_password.grid(row=1, column=1, sticky="w")

        tk.Label(self, text="Confirm Password").grid(
            row=2, column=0, sticky="e")
        self.entry_confirm_password = tk.Entry(self, show="*")
        self.entry_confirm_password.grid(row=2, column=1, sticky="w")

        tk.Label(self, text="Birthdate").grid(row=3, column=0, sticky="e")
        self.entry_birthdate = DateEntry(self, date_pattern='y-mm-dd')
        self.entry_birthdate.grid(row=3, column=1, sticky="w")

        tk.Label(self, text="Country").grid(row=4, column=0, sticky="e")
        self.country_var = tk.StringVar(value="Select Country")
        self.entry_country = tk.OptionMenu(
            self, self.country_var, "Egypt", "KSA", "USA")
        self.entry_country.grid(row=4, column=1, sticky="w")

        tk.Label(self, text="Phone Number").grid(row=5, column=0, sticky="e")
        self.entry_phone_number = tk.Entry(self)
        self.entry_phone_number.grid(row=5, column=1, sticky="w")

        tk.Button(self, text="Signup", command=self.signup).grid(
            row=6, column=0, columnspan=2, sticky="n")

    def get_next_ticket_id(self):
        if not os.path.exists('Utils/database.csv'):
            return 1
        with open('Utils/database.csv', mode='r', newline='') as file:
            reader = csv.reader(file)
            rows = list(reader)
            if len(rows) == 0:
                return 1
            try:
                last_ticket_id = int(rows[-1][0])
            except ValueError:
                last_ticket_id = 0
            return last_ticket_id + 1

    def signup(self):
        username = self.entry_username.get()
        password = self.entry_password.get()
        confirm_password = self.entry_confirm_password.get()
        birthdate = self.entry_birthdate.get()
        country = self.country_var.get()
        phone_number = self.entry_phone_number.get()

        if not username:
            messagebox.showerror("Error", "Username is required")
            return
        if not password:
            messagebox.showerror("Error", "Password is required")
            return
        if not confirm_password:
            messagebox.showerror("Error", "Confirm Password is required")
            return
        if not birthdate:
            messagebox.showerror("Error", "Birthdate is required")
            return
        if country == "Select Country":
            messagebox.showerror("Error", "Country is required")
            return
        if not phone_number:
            messagebox.showerror("Error", "Phone Number is required")
            return

        # Check if the username and password are in the CSV file
        if os.path.exists('Utils/database.csv'):
            with open('Utils/database.csv', mode='r', newline='') as file:
                reader = csv.reader(file)
                for row in reader:
                    if row and row[1] == username:
                        messagebox.showerror(
                            "Error", "Username already exists")
                        return
                    # if row and row[2] == password:
                    #     messagebox.showerror(
                    #         "Error", "Password already exists")
                    #     return

        if password != confirm_password:
            messagebox.showerror("Error", "Passwords do not match")
            return

        # Check if the user data is already in the CSV file
        if os.path.exists('Utils/database.csv'):
            with open('Utils/database.csv', mode='r', newline='') as file:
                reader = csv.reader(file)
                for row in reader:
                    if row and row[1] == username:
                        messagebox.showerror(
                            "Error", "Username already exists")
                        return

        ticket_id = self.get_next_ticket_id()
        no_of_tickets = 0

        # Add the new user data to the CSV file
        with open('Utils/database.csv', mode='a', newline='') as file:
            # file.write('\n')
            writer = csv.writer(file)
            writer.writerow(
                [ticket_id, username, password, birthdate, country, 0, no_of_tickets])

        messagebox.showinfo("Success", "Signup successful!")

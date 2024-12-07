import tkinter as tk
from tkinter import messagebox
from Src.Welcome import WelcomePage
from Src.Login import LoginPage
from Src.MainMenu import MainMenuPage
from Src.Bus import BusReservationPage, BusSelectionPage
from Src.Signup import SignupPage


class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Ticket Reservation System")
        self.geometry("600x400")
        self.bind("<Configure>", self.on_resize)
        self.frames = {}

        # Configure grid to center everything
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # Initialize frames
        for F in (WelcomePage, LoginPage, MainMenuPage, BusSelectionPage, BusReservationPage, SignupPage):
            frame = F(parent=self, controller=self)
            self.frames[F.__name__] = frame
            frame.grid(row=0, column=0, sticky="nsew")
            frame.grid_rowconfigure(0, weight=1)
            frame.grid_columnconfigure(0, weight=1)

        self.show_frame("WelcomePage")

    def center_window(self, width, height):
        screen_width = self.winfo_screenwidth()
        screen_height = self.winfo_screenheight()
        x = (screen_width // 2) - (width // 2)
        y = (screen_height // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')

    def show_frame(self, frame_name):
        frame = self.frames[frame_name]
        frame.tkraise()

    def pass_ticket_system_to_page(self, frame_name, ticket_system):
        """Pass ticket_system to the reservation page"""
        page = self.frames[frame_name]
        if isinstance(page, BusReservationPage):
            page.set_ticket_system(ticket_system)
        # You can add similar code for Airplane and Train reservation pages here

    def on_resize(self, event):
        self.center_window(self.winfo_width(), self.winfo_height())

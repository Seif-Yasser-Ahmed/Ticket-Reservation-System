import tkinter as tk
from tkinter import messagebox
from Src.Welcome import WelcomePage
from Src.Login import LoginPage
from Src.MainMenu import MainMenuPage
from Src.Bus import BusReservationPage, BusSelectionPage


class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Ticket Reservation System")
        self.geometry("600x400")
        self.frames = {}

        # Initialize frames
        for F in (WelcomePage, LoginPage, MainMenuPage, BusSelectionPage, BusReservationPage):
            frame = F(parent=self, controller=self)
            self.frames[F.__name__] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        self.show_frame("WelcomePage")

    def show_frame(self, frame_name):
        frame = self.frames[frame_name]
        frame.tkraise()

    def pass_ticket_system_to_page(self, frame_name, ticket_system):
        """Pass ticket_system to the reservation page"""
        page = self.frames[frame_name]
        if isinstance(page, BusReservationPage):
            page.set_ticket_system(ticket_system)
        # You can add similar code for Airplane and Train reservation pages here

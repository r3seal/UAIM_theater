from fpdf import FPDF
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import logging
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()


def send_ticket_email(user, tickets_bought):
    try:
        # 1. Gather ticket details
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        pdf.cell(200, 10, txt="Ticket Confirmation", ln=True, align='C')
        pdf.ln(10)

        for i, ticket in enumerate(tickets_bought, start=1):
            pdf.cell(200, 10, txt=f"Ticket {i}", ln=True, align='L')
            pdf.cell(200, 10, txt=f"Spectacle: {ticket['spectacle_title']}", ln=True, align='L')
            pdf.cell(200, 10, txt=f"Date: {ticket['date']}", ln=True, align='L')
            pdf.cell(200, 10, txt=f"Hall: {ticket['hall']}", ln=True, align='L')
            pdf.cell(200, 10, txt=f"Seat: Row {ticket['row']}, Seat {ticket['seat_number']}", ln=True, align='L')
            pdf.cell(200, 10, txt=f"Price: {ticket['price']} PLN", ln=True, align='L')
            pdf.ln(10)

        # Write to PDF file
        pdf_file_name = "ticket_confirmation.pdf"
        pdf.output(pdf_file_name)


        # 2. Prepare e-mail
        # You need to locally create a .env file (in the root directory), 
        # where you will include the environment variables listed below in the format: 
        # GMAIL_USER='user@example.com'
        gmail_user = os.getenv("GMAIL_USER")
        gmail_password = os.getenv("GMAIL_PASSWORD")

        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = user.email
        msg['Subject'] = "Your Ticket Confirmation"

        # Text message
        body = (
            f"Hello {user.name},\n\n"
            f"Thank you for purchasing tickets for {tickets_bought[0]['spectacle_title']}!\n"
            f"Please find your ticket details attached as a PDF.\n\n"
            f"Best regards,\nThe Theater Team"
        )
        msg.attach(MIMEText(body, 'plain'))

        # 3. Attach PDF file
        with open(pdf_file_name, "rb") as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={pdf_file_name}')
            msg.attach(part)

        # 4. Send e-mail
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, user.email, msg.as_string())
        server.close()

        logging.debug("Email sent successfully")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

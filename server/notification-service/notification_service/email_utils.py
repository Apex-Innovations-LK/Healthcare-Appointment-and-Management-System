import os
from email.message import EmailMessage
import aiosmtplib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get config values from .env
EMAIL_HOST = os.getenv("EMAIL_HOST")
# EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Reusable email sending function
async def send_email(to, subject, body):
    msg = EmailMessage()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    await aiosmtplib.send(
        msg,
        hostname=EMAIL_HOST,
        port=EMAIL_PORT,
        start_tls=True,
        username=EMAIL_ADDRESS,
        password=EMAIL_PASSWORD,
    )

# 🔔 Send alert to yourself if email sending or Kafka message fails
async def send_alert(to, error_info):
    subject = "🚨 Kafka Notification Service Error Alert"
    body = f"Something went wrong in your service:\n\n{error_info}"
    await send_email(to, subject, body)

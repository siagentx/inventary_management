from fastapi import APIRouter
from fastapi_mail import FastMail, MessageSchema, MessageType

from app.core.mail import conf
from app.tasks import send_email
router = APIRouter(prefix="/mail", tags=["Mail"])


@router.get("/test")
async def send_test_mail():

    message = MessageSchema(
        subject="IMS Test Email",
        recipients=["ganeshkumar310300@gmail.com"],   # <-- Replace with your Gmail
        body="""
        <h2>Hello from FastAPI IMS</h2>
        <p>Email configuration is working successfully.</p>
        """,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    send_email.delay(
    "ganeshkumar310300@gmail.com",
    "IMS Test Email",
    """
    <h2>Hello from Celery</h2>
    <p>This email was sent in the background.</p>
    """
)

    return {"message": "Email Sent Successfully"}
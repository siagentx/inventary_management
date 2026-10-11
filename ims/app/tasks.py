from app.celery_app import celery_app
from datetime import datetime
from app.database.database import SessionLocal
import app.models
from app.models.product import Product
from fastapi_mail import FastMail, MessageSchema, MessageType
from app.core.mail import conf
from app.core.email_templates import low_stock_template
from app.database.database import SessionLocal
from app.models.purchaseorders import PurchaseOrder
from app.models.purchaseorderitems import Purchaseorderitems
from app.models.supplier import Supplier
from app.temp.purchase_temp import purchase_order_template
from fastapi_mail import FastMail, MessageSchema, MessageType
from app.core.mail import conf
import asyncio
from app.utils.purchase_order_pdf import generate_purchase_order_pdf
@celery_app.task
def product_created(product_name: str):
    print("=" * 40)
    print(f"✅ Background Task Running")
    print(f"Product Created: {product_name}")
    print("=" * 40)

    return f"{product_name} processed successfully"

@celery_app.task
def inventory_check():
    db = SessionLocal()
    try:
        low_stock = (
            db.query(Product)
        .filter(Product.qty < 10)
        .all()
    )
        if not low_stock:
             print("No low stock products.")
             return

        html = low_stock_template(low_stock)

        send_email.delay(
              "ganeshkumar310300@gmail.com",
              "⚠ Low Stock Alert",
               html)
        print(html)
        print("=" * 50)
        print("LOW STOCK REPORT")

        if not low_stock:
           print("No low stock products.")

        for product in low_stock:
            print(product.name, product.qty)

        print("=" * 50)

    finally:
        db.close()

@celery_app.task
def send_email(recipient: str, subject: str, body: str):

    import asyncio

    async def send():
        message = MessageSchema(
            subject=subject,
            recipients=[recipient],
            body=body,
            subtype=MessageType.html,
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    asyncio.run(send())

    print("=" * 40)
    print("✅ Email Sent")
    print(recipient)
    print("=" * 40)

@celery_app.task
def send_purchase_order_email(purchase_order_id: int):

    db = SessionLocal()

    try:
        purchase_order = (
            db.query(PurchaseOrder)
            .filter(PurchaseOrder.id == purchase_order_id)
            .first()
        )

        if not purchase_order:
            print("❌ Purchase Order not found")
            return

        supplier = purchase_order.supplier

        items = (
            db.query(Purchaseorderitems)
            .filter(
                Purchaseorderitems.purchase_order_id == purchase_order.id
            )
            .all()
        )

        # Generate PDF
        pdf_path = generate_purchase_order_pdf(
            purchase_order.id
        )

        # Generate HTML email
        body = purchase_order_template(
            purchase_order,
            supplier,
            items
        )

        async def send():

            message = MessageSchema(
                subject=f"Purchase Order #{purchase_order.id}",
                recipients=[supplier.email],
                body=body,
                subtype=MessageType.html,
                attachments=[pdf_path],
            )

            fm = FastMail(conf)

            await fm.send_message(message)

        asyncio.run(send())

        print("=" * 50)
        print("✅ Purchase Order Email Sent")
        print(f"📧 To: {supplier.email}")
        print(f"📎 PDF: {pdf_path}")
        print("=" * 50)

    except Exception as e:

        print(f"❌ Failed to send Purchase Order email: {str(e)}")

        raise

    finally:
        db.close()
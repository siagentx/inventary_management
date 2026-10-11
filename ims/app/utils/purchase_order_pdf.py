from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from app.database.database import SessionLocal
from app.models.purchaseorders import PurchaseOrder
from app.models.purchaseorderitems import Purchaseorderitems
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parents[2]

PDF_DIR = BASE_DIR / "generated_pdfs"

os.makedirs(PDF_DIR, exist_ok=True)


def generate_purchase_order_pdf(purchase_order_id: int):

    db = SessionLocal()

    try:
        # Get Purchase Order
        purchase_order = (
            db.query(PurchaseOrder)
            .filter(PurchaseOrder.id == purchase_order_id)
            .first()
        )

        if not purchase_order:
            raise ValueError("Purchase Order not found")

        # Get Purchase Order Items
        items = (
            db.query(Purchaseorderitems)
            .filter(
                Purchaseorderitems.purchase_order_id
                == purchase_order.id
            )
            .all()
        )

        supplier = purchase_order.supplier

        # PDF path
        filename = f"Purchase_Order_{purchase_order.id}.pdf"
        filepath = os.path.join(PDF_DIR, filename)

        # Document
        doc = SimpleDocTemplate(
            filepath,
            pagesize=A4,
            rightMargin=20 * mm,
            leftMargin=20 * mm,
            topMargin=20 * mm,
            bottomMargin=20 * mm,
        )

        styles = getSampleStyleSheet()

        story = []

        # Title
        story.append(
            Paragraph(
                "<b>INVENTORY MANAGEMENT SYSTEM</b>",
                styles["Title"],
            )
        )

        story.append(Spacer(1, 10))

        story.append(
            Paragraph(
                "<b>PURCHASE ORDER</b>",
                styles["Heading2"],
            )
        )

        story.append(Spacer(1, 15))

        # PO information
        story.append(
            Paragraph(
                f"<b>PO Number:</b> #{purchase_order.id}",
                styles["Normal"],
            )
        )

        story.append(
            Paragraph(
                f"<b>Date:</b> {purchase_order.created_at}",
                styles["Normal"],
            )
        )

        story.append(Spacer(1, 10))

        # Supplier information
        story.append(
            Paragraph(
                "<b>Supplier Details</b>",
                styles["Heading3"],
            )
        )

        story.append(
            Paragraph(
                f"Company: {supplier.company}",
                styles["Normal"],
            )
        )

        story.append(
            Paragraph(
                f"Email: {supplier.email}",
                styles["Normal"],
            )
        )

        story.append(Spacer(1, 15))

        # Table header
        table_data = [
            [
                "Product",
                "SKU",
                "Qty",
                "Unit Price",
                "Total",
            ]
        ]

        # Add products
        for item in items:

            product_total = item.qty * item.unit_price

            table_data.append(
                [
                    item.product.name,
                    item.product.sku,
                    str(item.qty),
                    f"₹{item.unit_price:.2f}",
                    f"₹{product_total:.2f}",
                ]
            )

        # Create table
        table = Table(
            table_data,
            colWidths=[
                45 * mm,
                30 * mm,
                15 * mm,
                30 * mm,
                30 * mm,
            ],
        )

        table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.grey,
                    ),
                    (
                        "TEXTCOLOR",
                        (0, 0),
                        (-1, 0),
                        colors.white,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        "Helvetica-Bold",
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        1,
                        colors.black,
                    ),
                    (
                        "ALIGN",
                        (2, 1),
                        (-1, -1),
                        "RIGHT",
                    ),
                    (
                        "ALIGN",
                        (0, 0),
                        (-1, 0),
                        "CENTER",
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(table)

        story.append(Spacer(1, 20))

        # Total
        story.append(
            Paragraph(
                f"<b>Total Amount: ₹{purchase_order.total_amount:.2f}</b>",
                styles["Heading3"],
            )
        )

        story.append(Spacer(1, 10))

        # Status
        status = (
            purchase_order.status.value
            if purchase_order.status
            else "PENDING"
        )

        story.append(
            Paragraph(
                f"<b>Status:</b> {status}",
                styles["Normal"],
            )
        )

        story.append(Spacer(1, 30))

        story.append(
            Paragraph(
                "Inventory Management System",
                styles["Normal"],
            )
        )

        # Generate PDF
        doc.build(story)

        return filepath

    finally:
        db.close()
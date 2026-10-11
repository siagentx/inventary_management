from app.celery_app import celery_app
from datetime import datetime
from app.database.database import SessionLocal
import app.models
from app.models.product import Product



def low_stock_template(products):

    html = """
    <html>
        <body>
            <h2>⚠ Low Stock Alert</h2>

            <p>The following products are running low in stock.</p>

            <table border="1" cellspacing="0" cellpadding="8">
                <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                </tr>
    """

    for product in products:
        html += f"""
                <tr>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.qty}</td>
                </tr>
        """

    html += """
            </table>

            <br>

            <p>
                Please replenish these products as soon as possible.
            </p>

            <hr>

            <p>
                Inventory Management System
            </p>

        </body>
    </html>
    """

    return html


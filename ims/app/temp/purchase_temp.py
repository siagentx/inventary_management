def purchase_order_template(purchase_order, supplier, items):
    html = f"""
    <html>
    <body>

    <h2>📦 Purchase Order #{purchase_order.id}</h2>

    <p>Hello <b>{supplier.company}</b>,</p>

    <p>A new purchase order has been created.</p>

    <table border="1" cellspacing="0" cellpadding="8">
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
        </tr>
    """

    for item in items:
        html += f"""
        <tr>
            <td>{item.product.name}</td>
            <td>{item.qty}</td>
            <td>₹{item.unit_price}</td>
            <td>₹{item.qty * item.unit_price}</td>
        </tr>
        """

    html += f"""
    </table>

    <br>

    <h3>Total Amount : ₹{purchase_order.total_amount}</h3>

    <p>Status : {purchase_order.status.value}</p>

    <br>

    <p>Regards,</p>

    <p><b>Inventory Management System</b></p>

    </body>
    </html>
    """

    return html
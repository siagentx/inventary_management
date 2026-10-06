Inventory Management System

A full-stack Inventory Management System built to manage products, categories, suppliers, stock transactions, purchase orders, and sales orders.

The application provides a simple dashboard-based interface for managing inventory efficiently with CRUD operations, filtering, pagination, and order management.

🚀 Features
📦 Product Management

Create products

View all products

View product details

Edit products

Delete products

Assign products to categories

Assign products to suppliers

Manage product SKU, price, and quantity

Product pagination

Product search

Product filtering

Product sorting

Minimum and maximum price filtering

📂 Category Management

Create category

View categories

View category details

Edit category

Delete category

🚚 Supplier Management

Create supplier

View suppliers

View supplier details

Edit supplier

Delete supplier

Store supplier company, contact, email, and phone

🔄 Stock Transactions

Create stock transaction

Select product

Stock IN transaction

Stock OUT transaction

Add quantity

Add remarks

View transaction details

Edit transaction

Delete transaction

Stock transaction type supports:

IN
OUT

🛒 Purchase Orders

Create purchase order

Select supplier

Add products and quantities

View purchase orders

View purchase order details

Edit purchase order

Delete purchase order

Receive purchase order

💰 Sales Orders

Create sales order

Customer name management

Sales order status management

Total amount management

View sales orders

View sales order details

Edit sales orders

Delete sales orders

Sales order status supports:

PENDING
COMPLETED
CANCELED

🛠️ Tech Stack
Frontend

React.js

React Router

Axios

Tailwind CSS

JavaScript

Backend

Python

FastAPI

SQLAlchemy

Pydantic

PostgreSQL

Redis

Development Tools

Git

GitHub

VS Code

Postman



🗄️ Main Entities

The system contains the following main entities:

Category
   │
   └── Product
          │
          ├── Supplier
          │
          └── Stock Transactions


Supplier
   │
   └── Purchase Orders


Customer
   │
   └── Sales Orders

Product

A product contains:

id
sku
name
category_id
supplier_id
price
qty
created_at
updated_at

Supplier
id
company
contact
email
phone
created_at
updated_at

Stock Transaction
id
product_id
type
qty
remarks
created_at
updated_at


Transaction type:

IN
OUT

Sales Order
id
cust_name
status
total_amount
created_at
updated_at


Sales status:

PENDING
COMPLETED
CANCELED


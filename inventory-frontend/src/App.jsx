import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import Category from "./components/category/Category";
import Createcategories from "./components/category/Createcategory";
import Categorydetails from "./components/category/Categorydetails";
import Editcategory from "./components/category/Editcategory";

import Supplier from "./components/supplier/Supplier"
import Createsupplier from "./components/supplier/Createsupplier"
import Supplierdetails from "./components/supplier/Supplierdetails"
import Editsupplier from "./components/supplier/Editsupplier"

import Product from "./components/product/Product"
import Createproduct from "./components/product/Createproduct"
import Productdetails from "./components/product/Productdetails"
import Editproduct from "./components/product/Editproduct"

import Stocktran from "./components/stocktransactions/Stocktran"
import CreateStocktran from "./components/stocktransactions/CreateStocktran"
import Stocktrandetails from "./components/stocktransactions/Stocktrandetails"
import Editstocktran from "./components/stocktransactions/Editstocktran"

import PurchaseOrder from "./components/purchaseorder/PurchaseOrder"
import CreatePurchaseOrder from "./components/purchaseorder/CreatePurchaseOrder"
import PurchaseOrderDetails from "./components/purchaseorder/PurchaseOrderDetails"
import EditPurchaseOrder from "./components/purchaseorder/EditPurchaseOrder"

import SalesOrder from "./components/salesorder/SalesOrder"
import CreateSalesOrder from "./components/salesorder/CreateSalesOrder"
import SalesOrderDetails from "./components/salesorder/SalesOrderDetails"
import EditSalesOrder from "./components/salesorder/EditSalesOrder"
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Login - No Sidebar */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />

          {/* Categories */}
          <Route
            path="/categories"
            element={
              <AppLayout>
                <Category />
              </AppLayout>
            }
          />

          {/* Create Category */}
          <Route
            path="/categories/create"
            element={
              <AppLayout>
                <Createcategories />
              </AppLayout>
            }
          />

          {/* Category Details */}
          <Route
            path="/categories/:categoryId"
            element={
              <AppLayout>
                <Categorydetails />
              </AppLayout>
            }
          />

          {/* Edit Category */}
          <Route
            path="/categories/:categoryId/edit"
            element={
              <AppLayout>
                <Editcategory />
              </AppLayout>
            }
          />
          <Route
            path="/suppliers"
            element={
              <AppLayout>
                <Supplier />
              </AppLayout>
            }
          />
           <Route
            path="/suppliers/create_supplier"
            element={
              <AppLayout>
                <Createsupplier />
              </AppLayout>
            }
          />
          <Route
            path="/suppliers/:supplierId"
            element={
              <AppLayout>
                <Supplierdetails />
              </AppLayout>
            }
          />
          <Route
            path="/suppliers/:supplierId/edit"
            element={
              <AppLayout>
                <Editsupplier />
              </AppLayout>
            }
          />
          <Route
            path="/products"
            element={
              <AppLayout>
                <Product />
              </AppLayout>
            }
          />
           <Route
            path="/products/create_product"
            element={
              <AppLayout>
                <Createproduct />
              </AppLayout>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <AppLayout>
                <Productdetails />
              </AppLayout>
            }
          />
          <Route
            path="/products/:productId/edit"
            element={
              <AppLayout>
                <Editproduct />
              </AppLayout>
            }
          />
          <Route
            path="/stocktransactions"
            element={
              <AppLayout>
                <Stocktran />
              </AppLayout>
            }
          />
           <Route
            path="/stocktransactions/create_tran"
            element={
              <AppLayout>
                <CreateStocktran />
              </AppLayout>
            }
          />
          <Route
            path="/stocktransactions/:stocktranId"
            element={
              <AppLayout>
                <Stocktrandetails />
              </AppLayout>
            }
          />
          <Route
            path="/stocktransactions/:stocktranId/edit"
            element={
              <AppLayout>
                <Editstocktran />
              </AppLayout>
            }
          />
          <Route path="/purchase_orders"
  element={ <AppLayout><PurchaseOrder /> </AppLayout>}
/>

<Route
  path="/purchase_orders/create_purchase"
  element={ <AppLayout><CreatePurchaseOrder /> </AppLayout>}
/>

<Route
  path="/purchase_orders/:poId/edit"
  element={ <AppLayout><EditPurchaseOrder /> </AppLayout>}
/>

<Route
  path="/purchase_orders/:poId"
  element={ <AppLayout><PurchaseOrderDetails /> </AppLayout>}
/>
<Route path="/salesorder"
  element={ <AppLayout><SalesOrder/> </AppLayout>}
/>

<Route
  path="/sales_order/create_so"
  element={ <AppLayout><CreateSalesOrder /> </AppLayout>}
/>

<Route
  path="/sales_order/:soId/edit"
  element={ <AppLayout><EditSalesOrder /> </AppLayout>}
/>

<Route
  path="/sales_order/:soId"
  element={ <AppLayout><SalesOrderDetails /> </AppLayout>}
/>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}


function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default App;

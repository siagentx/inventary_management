import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white">
     <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>
<nav className="p-4 space-y-2">
<NavLink to="/dashboard" className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          🗂️ Categories
        </NavLink>
        <NavLink
          to="/suppliers"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          🏢 Suppliers
        </NavLink>
        <NavLink
  to="/products"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`
  }
>
  📦 Products
</NavLink>
 <NavLink
  to="/stocktransactions"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`
  }
>
  📦 Stock Transactions
</NavLink>
<NavLink
  to="/purchase_orders"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`
  }
>
  📦 Purchase Orders
</NavLink>
<NavLink
  to="/salesorder"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`
  }
>
  📦 Sales Orders
</NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;
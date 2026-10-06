import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSales,
  DeleteSo,
} from "../../services/salesService";

function SalesOrder() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await getSales();

        setSalesOrders(response.data);
      } catch (error) {
        console.error("Sales Order Error:", error);
        setError("Failed to load sales orders");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, []);

  const handleDelete = async (soId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sales order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await DeleteSo(soId);

      setSalesOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order.id !== soId
        )
      );
    } catch (error) {
      console.error("Delete Sales Order Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to delete sales order");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading sales orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Sales Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your sales orders
          </p>
        </div>

        <button
          onClick={() => navigate("/salesorders/create_so")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Create Sales Order
        </button>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {salesOrders.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No sales orders found.
                  </td>
                </tr>

              ) : (

                salesOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="hover:bg-gray-50"
                  >

                    {/* ID */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {order.id}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {order.cust_name}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>

                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        ₹{order.total_amount}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            navigate(
                              `/salesorders/${order.id}/edit`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(order.id)
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/salesorders/${order.id}`
                            )
                          }
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          View
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default SalesOrder;

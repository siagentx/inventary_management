import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPOs,
  Deletepo,
  Statuspo,
} from "../../services/poService";

function PurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch Purchase Orders
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await getPOs();

        setPurchaseOrders(response.data);
      } catch (error) {
        console.error(
          "Purchase Order Error:",
          error
        );

        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError(
            "Failed to load purchase orders"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  // Delete
  const handleDelete = async (poId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this purchase order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await Deletepo(poId);

      setPurchaseOrders(
        (previousOrders) =>
          previousOrders.filter(
            (po) => po.id !== poId
          )
      );

    } catch (error) {
      console.error(
        "Delete Purchase Order Error:",
        error
      );

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Failed to delete purchase order"
        );
      }
    }
  };

  // Receive
  const handleReceive = async (poId) => {
    const confirmed = window.confirm(
      "Are you sure you want to receive this purchase order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await Statuspo(poId);

      setPurchaseOrders(
        (previousOrders) =>
          previousOrders.map((po) =>
            po.id === poId
              ? response.data
              : po
          )
      );

    } catch (error) {
      console.error(
        "Receive Purchase Order Error:",
        error
      );

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Failed to receive purchase order"
        );
      }
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading purchase orders...
        </p>
      </div>
    );
  }

  // Error
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
            Purchase Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your purchase orders
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/purchase_orders/create_purchase"
            )
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Create Purchase Order
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
                  Supplier
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Items
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {purchaseOrders.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No purchase orders found.
                  </td>
                </tr>

              ) : (

                purchaseOrders.map((po) => (

                  <tr
                    key={po.id}
                    className="hover:bg-gray-50"
                  >

                    {/* ID */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {po.id}
                      </p>
                    </td>

                    {/* Supplier */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {po.supplier_name ||
                          po.supplier?.company ||
                          po.supplier_id ||
                          "N/A"}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">

                      <div className="space-y-1">

                        {po.items?.map(
                          (item, index) => (
                            <p
                              key={index}
                              className="text-sm text-gray-700"
                            >
                              Product ID:{" "}
                              {item.product_id}
                              {" — "}
                              Qty: {item.qty}
                            </p>
                          )
                        )}

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      {po.status ===
                      "RECEIVED" ? (

                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          RECEIVED
                        </span>

                      ) : (

                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                          {po.status ||
                            "PENDING"}
                        </span>

                      )}

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            navigate(
                              `/purchase_orders/${po.id}/edit`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(po.id)
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/purchase_orders/${po.id}`
                            )
                          }
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          View
                        </button>

                        {po.status !==
                          "RECEIVED" && (
                          <button
                            onClick={() =>
                              handleReceive(
                                po.id
                              )
                            }
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Receive
                          </button>
                        )}

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

export default PurchaseOrder;

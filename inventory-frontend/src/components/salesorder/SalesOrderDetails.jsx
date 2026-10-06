import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSObyId } from "../../services/salesService";

function SalesOrderDetails() {
  const { soId } = useParams();
  const navigate = useNavigate();

  const [salesOrder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalesOrder = async () => {
      try {
        const response = await getSObyId(soId);

        setSalesOrder(response.data);
      } catch (error) {
        console.error("Sales Order Details Error:", error);

        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError("Failed to load sales order");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrder();
  }, [soId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading sales order...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!salesOrder) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Sales order not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Sales Order Details
          </h1>

          <p className="text-gray-500 mt-1">
            View sales order information
          </p>
        </div>

        <button
          onClick={() => navigate("/salesorders")}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>

      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Card Header */}
        <div className="p-6 border-b border-gray-200">

          <p className="text-sm text-gray-500">
            Sales Order ID
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-1">
            #{salesOrder.id}
          </h2>

        </div>

        {/* Information */}
        <div className="p-6">

          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Sales Order Information
          </h3>

          <div className="mt-4 space-y-4">

            {/* ID */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                ID
              </span>

              <span className="font-semibold text-gray-800">
                {salesOrder.id}
              </span>
            </div>

            {/* Customer */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Customer Name
              </span>

              <span className="font-semibold text-gray-800">
                {salesOrder.cust_name || "N/A"}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Status
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  salesOrder.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : salesOrder.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {salesOrder.status}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Total Amount
              </span>

              <span className="font-semibold text-gray-800">
                ₹{salesOrder.total_amount}
              </span>
            </div>

            {/* Created */}
            {salesOrder.created_at && (
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    salesOrder.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Updated */}
            {salesOrder.updated_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Updated
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    salesOrder.updated_at
                  ).toLocaleDateString()}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">

          <button
            onClick={() =>
              navigate(`/salesorders/${salesOrder.id}/edit`)
            }
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Edit Sales Order
          </button>

        </div>

      </div>

    </div>
  );
}

export default SalesOrderDetails;

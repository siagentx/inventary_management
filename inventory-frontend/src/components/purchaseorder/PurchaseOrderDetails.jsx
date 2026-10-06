import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getPobyId,
  Statuspo,
} from "../../services/poService";

function PurchaseOrderDetails() {
  const { poId } = useParams();
  const navigate = useNavigate();

  const [purchaseOrder, setPurchaseOrder] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [receiving, setReceiving] = useState(false);
  const [error, setError] = useState("");

  // Fetch PO
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response =
          await getPobyId(poId);

        setPurchaseOrder(response.data);
      } catch (error) {
        console.error(
          "Purchase Order Details Error:",
          error
        );

        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError(
            "Failed to load purchase order"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [poId]);

  // Receive
  const handleReceive = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to receive this purchase order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setReceiving(true);
      setError("");

      const response =
        await Statuspo(poId);

      setPurchaseOrder(response.data);

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
    } finally {
      setReceiving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading purchase order...
        </p>
      </div>
    );
  }

  // Error
  if (error && !purchaseOrder) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Not found
  if (!purchaseOrder) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Purchase order not found
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
            Purchase Order Details
          </h1>

          <p className="text-gray-500 mt-1">
            View purchase order information
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/purchase_orders")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Card Header */}
        <div className="p-6 border-b border-gray-200">

          <p className="text-sm text-gray-500">
            Purchase Order ID
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-1">
            {purchaseOrder.id}
          </h2>

        </div>

        {/* Information */}
        <div className="p-6">

          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Purchase Order Information
          </h3>

          <div className="mt-4 space-y-4">

            {/* ID */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                ID
              </span>

              <span className="font-semibold text-gray-800">
                {purchaseOrder.id}
              </span>
            </div>

            {/* Supplier */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Supplier
              </span>

              <span className="font-semibold text-gray-800">
                {purchaseOrder.supplier_name ||
                  purchaseOrder.supplier?.company ||
                  purchaseOrder.supplier_id ||
                  "N/A"}
              </span>
            </div>

            {/* Items */}
            <div className="border-b pb-4">

              <p className="text-gray-500 mb-3">
                Items
              </p>

              <div className="space-y-3">

                {purchaseOrder.items?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                    >

                      <div>
                        <p className="font-semibold text-gray-800">
                          Product ID:{" "}
                          {item.product_id}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.qty}
                        </p>
                      </div>

                      <span className="font-semibold text-gray-700">
                        Qty {item.qty}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* Status */}
            <div className="flex justify-between items-center border-b pb-3">

              <span className="text-gray-500">
                Status
              </span>

              {purchaseOrder.status ===
              "RECEIVED" ? (

                <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  RECEIVED
                </span>

              ) : (

                <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                  {purchaseOrder.status ||
                    "PENDING"}
                </span>

              )}

            </div>

            {/* Created */}
            {purchaseOrder.created_at && (
              <div className="flex justify-between items-center border-b pb-3">

                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    purchaseOrder.created_at
                  ).toLocaleString()}
                </span>

              </div>
            )}

            {/* Updated */}
            {purchaseOrder.updated_at && (
              <div className="flex justify-between items-center">

                <span className="text-gray-500">
                  Updated
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    purchaseOrder.updated_at
                  ).toLocaleString()}
                </span>

              </div>
            )}

          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">

          {purchaseOrder.status !==
            "RECEIVED" && (
            <button
              onClick={handleReceive}
              disabled={receiving}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {receiving
                ? "Receiving..."
                : "Receive Order"}
            </button>
          )}

          <button
            onClick={() =>
              navigate(
                `/purchase_orders/${purchaseOrder.id}/edit`
              )
            }
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Edit Purchase Order
          </button>

        </div>

      </div>

    </div>
  );
}

export default PurchaseOrderDetails;

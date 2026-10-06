import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getStocktran,
} from "../../services/stocktran";

function Stocktransactiondetails() {
  const { stocktranId } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response =
          await getStocktran(stocktranId);

        setTransaction(response.data);
      } catch (error) {
        console.error(
          "Stock Transaction Details Error:",
          error
        );

        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError(
            "Failed to load stock transaction"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [stocktranId]);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading stock transaction...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Not found
  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Stock transaction not found
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
            Stock Transaction Details
          </h1>

          <p className="text-gray-500 mt-1">
            View stock transaction information
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/stocktransactions")
          }
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
            Transaction ID
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-1">
            {transaction.id}
          </h2>

        </div>

        {/* Transaction Information */}
        <div className="p-6">

          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Transaction Information
          </h3>

          <div className="mt-4 space-y-4">

            {/* ID */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                ID
              </span>

              <span className="font-semibold text-gray-800">
                {transaction.id}
              </span>
            </div>

            {/* Product */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Product
              </span>

              <span className="font-semibold text-gray-800">
                {transaction.product_name ||
                  transaction.product_id ||
                  "N/A"}
              </span>
            </div>

            {/* Product ID */}
            {transaction.product_id && (
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">
                  Product ID
                </span>

                <span className="font-semibold text-gray-800">
                  {transaction.product_id}
                </span>
              </div>
            )}

            {/* Type */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Transaction Type
              </span>

              {transaction.type === "IN" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  IN - Stock Added
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                  OUT - Stock Removed
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Quantity
              </span>

              <span className="font-semibold text-gray-800">
                {transaction.qty}
              </span>
            </div>

            {/* Remarks */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Remarks
              </span>

              <span className="font-semibold text-gray-800">
                {transaction.remarks || "N/A"}
              </span>
            </div>

            {/* Created At */}
            {transaction.created_at && (
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    transaction.created_at
                  ).toLocaleString()}
                </span>
              </div>
            )}

            {/* Updated At */}
            {transaction.updated_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Updated
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    transaction.updated_at
                  ).toLocaleString()}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">

          <button
            onClick={() =>
              navigate(
                `/stocktransactions/${transaction.id}/edit`
              )
            }
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Edit Transaction
          </button>

        </div>

      </div>

    </div>
  );
}

export default Stocktransactiondetails;

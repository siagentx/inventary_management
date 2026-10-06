import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStocktran,
  Deletestocktran,
} from "../../services/stocktran";

function Stocktran() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getStocktran();

        setTransactions(response.data);
      } catch (error) {
        console.error(
          "Stock Transactions Error:",
          error
        );

        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError(
            "Failed to load stock transactions"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Delete
  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stock transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await Deletestocktran(transactionId);

      setTransactions((previousTransactions) =>
        previousTransactions.filter(
          (transaction) =>
            transaction.id !== transactionId
        )
      );
    } catch (error) {
      console.error(
        "Delete Stock Transaction Error:",
        error
      );

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Failed to delete stock transaction"
        );
      }
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading stock transactions...
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
            Stock Transactions
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your stock IN and OUT transactions
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/stocktransactions/create_tran"
            )
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Create Transaction
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
                  Product
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Type
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Remarks
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {transactions.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No stock transactions found.
                  </td>

                </tr>

              ) : (

                transactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50"
                  >

                    {/* ID */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {transaction.id}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {transaction.product_name ||
                          transaction.product_id ||
                          "N/A"}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">

                      {transaction.type === "IN" ? (

                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          IN
                        </span>

                      ) : (

                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                          OUT
                        </span>

                      )}

                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {transaction.qty}
                      </p>
                    </td>

                    {/* Remarks */}
                    <td className="px-6 py-4">
                      <p className="text-gray-600">
                        {transaction.remarks || "N/A"}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(
                              `/stocktransactions/${transaction.id}/edit`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(
                              transaction.id
                            )
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(
                              `/stocktransactions/${transaction.id}`
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

export default Stocktran;

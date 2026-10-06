import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSObyId,
  UpdateSO,
} from "../../services/salesService";

function EditSalesOrder() {
  const { soId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cust_name: "",
    status: "PENDING",
    total_amount: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalesOrder = async () => {
      try {
        const response = await getSObyId(soId);

        const salesOrder = response.data;

        setFormData({
          cust_name: salesOrder.cust_name || "",
          status: salesOrder.status || "PENDING",
          total_amount: salesOrder.total_amount ?? "",
        });
      } catch (error) {
        console.error("Sales Order Error:", error);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await UpdateSO(soId, {
        cust_name: formData.cust_name,
        status: formData.status,
        total_amount: Number(formData.total_amount),
      });

      navigate("/salesorders");
    } catch (error) {
      console.error("Update Sales Order Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to update sales order");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading Sales Order...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Sales Order
        </h1>

        <p className="text-gray-500 mt-1">
          Update sales order
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>

            <input
              type="text"
              name="cust_name"
              value={formData.cust_name}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount
            </label>

            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter total amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={() => navigate("/salesorders")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditSalesOrder;

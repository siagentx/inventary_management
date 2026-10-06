import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSupplierbyId } from "../../services/supplierService";

function Supplierdetails() {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const [supplier, setSuppliers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await getSupplierbyId(supplierId);

        setSuppliers(response.data);
      } catch (error) {
        console.error("Category Details Error:", error);
        setError("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading supplier...</p>
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

  // Category not found
  if (!supplier) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Supplier not found
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
            Supplier Details
          </h1>

          <p className="text-gray-500 mt-1">
            View supplier information
          </p>
        </div>

        <button
          onClick={() => navigate("/suppliers")}
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
            Supplier ID
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-1">
            {supplier.id}
          </h2>
        </div>

        {/* Category Information */}
        <div className="p-6">

          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Supplier Information
          </h3>

          <div className="mt-4 space-y-4">

            {/* ID */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                ID
              </span>

              <span className="font-semibold text-gray-800">
                {supplier.id}
              </span>
            </div>

            {/* Name */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Company
              </span>

              <span className="font-semibold text-gray-800">
                {supplier.company || "N/A"}
              </span>
              <span className="text-gray-500">
                Contact
              </span>
              <span className="font-semibold text-gray-800">
                {supplier.contact || "N/A"}
              </span>
              <span className="text-gray-500">
                Email
              </span>
              <span className="font-semibold text-gray-800">
                {supplier.email || "N/A"}
              </span>
              <span className="text-gray-500">
                Phone
              </span>
              <span className="font-semibold text-gray-800">
                {supplier.phone || "N/A"}
              </span>
            </div>


            {/* Created At */}
            {supplier.created_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    supplier.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Updated At */}
            {supplier.updated_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Updated
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    supplier.updated_at
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
              navigate(`/suppliers/${supplier.id}/edit`)
            }
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Edit Category
          </button>

        </div>

      </div>

    </div>
  );
}

export default Supplierdetails;

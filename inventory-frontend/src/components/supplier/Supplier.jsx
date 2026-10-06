import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSuppliers,
  Deletesupplier,
} from "../../services/supplierService";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getSuppliers();

        setSuppliers(response.data);
      } catch (error) {
        console.error("Category Error:", error);

        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (SupplierId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await Deletesupplier(SupplierId);

      setSuppliers((previousSuppliers) =>
        previousSuppliers.filter(
          (supplier) => supplier.id !== SupplierId
        )
      );
    } catch (error) {
      console.error("Delete Category Error:", error);

      setError("Failed to delete category");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading categories...
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
            Suppliers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your Suppliers
          </p>
        </div>

        <button
          onClick={() => navigate("/suppliers/create_supplier")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Create Supplier
        </button>

      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Supplier Company
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Supplier Contact
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Supplier Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Supplier Phone
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {suppliers.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No categories found.
                  </td>

                </tr>

              ) : (

                suppliers.map((supplier) => (

                  <tr
                    key={supplier.id}
                    className="hover:bg-gray-50"
                  >

                    {/* ID */}
                    <td className="px-6 py-4">

                      <p className="font-semibold text-gray-800">
                        {supplier.id}
                      </p>

                    </td>

                    {/* Category Name */}
                    <td className="px-6 py-4">

                      <p className="font-medium text-gray-800">
                        {supplier.company}
                      </p>

                    </td>
                     <td className="px-6 py-4">

                      <p className="font-medium text-gray-800">
                        {supplier.email}
                      </p>

                    </td>
                     <td className="px-6 py-4">

                      <p className="font-medium text-gray-800">
                        {supplier.phone}
                      </p>

                    </td>


                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(
                              `/suppliers/${supplier.id}/edit`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(supplier.id)
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(
                              `/suppliers/${supplier.id}`
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

export default Supplier;

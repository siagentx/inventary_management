import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPO } from "../../services/poService";
import { getSuppliers } from "../../services/supplierService";
import { getProducts } from "../../services/productService";

function CreatePurchaseOrder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplier_id: "",
    product_id: "",
    qty: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Suppliers and Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierResponse, productResponse] =
          await Promise.all([
            getSuppliers(),
            getProducts(),
          ]);

        setSuppliers(supplierResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error(
          "Dropdown Data Error:",
          error
        );

        setError(
          "Failed to load suppliers and products"
        );
      }
    };

    fetchData();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createPO({
        supplier_id: Number(formData.supplier_id),

        items: [
          {
            product_id: Number(formData.product_id),
            qty: Number(formData.qty),
          },
        ],
      });

      navigate("/purchase_orders");
    } catch (error) {
      console.error(
        "Create Purchase Order Error:",
        error
      );

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Failed to create purchase order"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Create Purchase Order
        </h1>

        <p className="text-gray-500 mt-1">
          Create a new purchase order
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>

            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select Supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.company}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>

            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                  {product.sku
                    ? ` (${product.sku})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>

            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              min="1"
              required
              placeholder="Enter quantity"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={() =>
              navigate("/purchase_orders")
            }
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Purchase Order"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default CreatePurchaseOrder;

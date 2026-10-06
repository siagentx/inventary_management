import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../../services/productService.js";

import { createStocktran } from "../../services/stocktran.js";

function CreateStocktran() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_id: "",
    type: "",
    qty: "",
    remarks: "",
  });

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          skip: 0,
          limit: 100,
        });

        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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
    setLoading(true);

    try {
      await createStocktran({
        product_id: Number(formData.product_id),
        type: formData.type,
        qty: Number(formData.qty),
        remarks: formData.remarks,
      });

      navigate("/stocktransactions");

    } catch (error) {
      console.error("Create Stock Transaction Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to create stock transaction");
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
          Create Stock Transaction
        </h1>

        <p className="text-gray-500 mt-1">
          Add stock IN or OUT transaction
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

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>

            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              disabled={loadingProducts}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            >
              <option value="">
                {loadingProducts
                  ? "Loading products..."
                  : "Select Product"}
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} {product.sku ? `(${product.sku})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">
                Select Transaction Type
              </option>

              <option value="IN">
                IN - Stock Added
              </option>

              <option value="OUT">
                OUT - Stock Removed
              </option>
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
              placeholder="Enter quantity"
              min="1"
              step="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>

            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Transaction Info */}
        {formData.type && (
          <div
            className={`mt-5 p-4 rounded-lg ${
              formData.type === "IN"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {formData.type === "IN" ? (
              <p>
                <span className="font-semibold">
                  IN:
                </span>{" "}
                This quantity will be added to the product stock.
              </p>
            ) : (
              <p>
                <span className="font-semibold">
                  OUT:
                </span>{" "}
                This quantity will be removed from the product stock.
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={() => navigate("/stocktransactions")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || loadingProducts}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Transaction"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default CreateStocktran;

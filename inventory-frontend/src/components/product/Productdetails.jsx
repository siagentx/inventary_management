import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProductbyId } from "../../services/productService";

function Productdetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductbyId(productId);

        setProduct(response.data);
      } catch (error) {
        console.error("Product Details Error:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading product...
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

  // Product not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Product not found
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
            Product Details
          </h1>

          <p className="text-gray-500 mt-1">
            View product information
          </p>
        </div>

        <button
          onClick={() => navigate("/products")}
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
            Product ID
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-1">
            {product.id}
          </h2>

        </div>

        {/* Product Information */}
        <div className="p-6">

          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Product Information
          </h3>

          <div className="mt-4 space-y-4">

            {/* ID */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                ID
              </span>

              <span className="font-semibold text-gray-800">
                {product.id}
              </span>
            </div>

            {/* SKU */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                SKU
              </span>

              <span className="font-semibold text-gray-800">
                {product.sku || "N/A"}
              </span>
            </div>

            {/* Product Name */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Product Name
              </span>

              <span className="font-semibold text-gray-800">
                {product.name || "N/A"}
              </span>
            </div>

            {/* Category */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Category
              </span>

              <span className="font-semibold text-gray-800">
                {product.category_id || "N/A"}
              </span>
            </div>

            {/* Supplier */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Supplier
              </span>

              <span className="font-semibold text-gray-800">
                {product.supplier_id || "N/A"}
              </span>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Price
              </span>

              <span className="font-semibold text-gray-800">
                ₹{product.price || "0"}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Quantity
              </span>

              <span className="font-semibold text-gray-800">
                {product.qty ?? "0"}
              </span>
            </div>

            {/* Created At */}
            {product.created_at && (
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    product.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Updated At */}
            {product.updated_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Updated
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(
                    product.updated_at
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
              navigate(`/products/${product.id}/edit`)
            }
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Edit Product
          </button>

        </div>

      </div>

    </div>
  );
}

export default Productdetails;

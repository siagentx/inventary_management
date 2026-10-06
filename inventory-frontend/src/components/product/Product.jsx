import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  Deleteproduct,
} from "../../services/productService";

function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sorting
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const skip = (page - 1) * limit;

      const response = await getProducts({
        skip,
        limit,
        search: search || undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        sort: sort || undefined,
        order,
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Product Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever pagination/filter/sort changes
  useEffect(() => {
    fetchProducts();
  }, [page, limit, search, minPrice, maxPrice, sort, order]);

  // Delete Product
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await Deleteproduct(productId);

      // Refresh current page
      fetchProducts();
    } catch (error) {
      console.error("Delete Product Error:", error);

      setError("Failed to delete product");
    }
  };

  // Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Minimum price
  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  // Maximum price
  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  // Sort
  const handleSort = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  // Order
  const handleOrder = (e) => {
    setOrder(e.target.value);
    setPage(1);
  };

  // Items per page
  const handleLimit = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading products...
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
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your Products
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/products/create_product")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Create Product
        </button>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search product..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>

            <input
              type="number"
              value={minPrice}
              onChange={handleMinPrice}
              placeholder="Min price"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>

            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPrice}
              placeholder="Max price"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>

            <select
              value={sort}
              onChange={handleSort}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="qty">Quantity</option>
              <option value="created_at">
                Created Date
              </option>
            </select>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>

            <select
              value={order}
              onChange={handleOrder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  SKU
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Product Name
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Price
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {products.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                products.map((product) => (

                  <tr
                    key={product.id}
                    className="hover:bg-gray-50"
                  >

                    {/* ID */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {product.id}
                      </p>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {product.sku}
                      </p>
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        ₹{product.price}
                      </p>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {product.qty}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(
                              `/products/${product.id}/edit`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(
                              `/products/${product.id}`
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">

          {/* Page Info */}
          <div className="flex items-center gap-4">

            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-gray-700">
                {page}
              </span>
            </p>

            <div className="flex items-center gap-2">

              <label className="text-sm text-gray-500">
                Show
              </label>

              <select
                value={limit}
                onChange={handleLimit}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>

            </div>

          </div>

          {/* Previous / Next */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setPage((previous) => previous - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <button
              onClick={() => setPage((previous) => previous + 1)}
              disabled={products.length < limit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Product;

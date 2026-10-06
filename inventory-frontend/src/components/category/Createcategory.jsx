import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategories } from "../../services/categoryService.js";

function Createcategory() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
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
await createCategories({
        name: formData.name,
      });

      navigate("/categories");

    } catch (error) {

      console.error("Create Invoice Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to create invoice");
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
          Create Category
        </h1>
        <p className="text-gray-500 mt-1">
          Create a new category for your product
        </p>
        </div>
{/* Error */}
{error && (<div className="mb-5 p-4 rounded-lg bg-red-100 text-red-700">{error}</div>)}
{/* Form */}
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
<input type="text" name="name" value={formData.name} onChange={handleChange}
placeholder="Enter category name"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
required />
</div>
</div>



        {/* Buttons */}

        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default Createcategory;
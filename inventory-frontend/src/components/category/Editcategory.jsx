import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCategoriesbyid,
  editCategories,
} from "../../services/categoryService";

function Editcategory() {

  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // Get existing category

useEffect(() => {
  const fetchCategory = async () => {
    try {
      const response = await getCategoriesbyid(categoryId);

      setFormData({
        name: response.data.name || "",
      });
    } catch (error) {
      console.error("Category Error:", error);
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, [categoryId]);


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

      await editCategories(categoryId, {
        name: formData.name,
      });

      navigate("/categories");

    } catch (error) {

      console.error("Update category Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to update category");
      }

    } finally {

      setSaving(false);

    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading invoice...
        </p>
      </div>
    );
  }

return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
              <p className="text-gray-500 mt-1">Update Category Name</p>
        </div>
        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
      )}
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
       <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter category name"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>
    </div>
    <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={() => navigate("/categories")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          </div>
          </form>
        </div>
  );
}
export default Editcategory;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSupplierbyId,
  Updatesupplier,
} from "../../services/supplierService";

function Editsupplier() {

  const { supplierId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company:"",
    contact:"",
    email:"",
    phone:""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // Get existing category

useEffect(() => {
  const fetchCategory = async () => {
    try {
      const response = await getSupplierbyId(supplierId);

      setFormData({
        company: response.data.company || "",
        contact: response.data.contact || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      console.error("Category Error:", error);
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, [supplierId]);


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

      await Updatesupplier(supplierId, {
        company: formData.company,
        contact: formData.contact,
        email:formData.email,
        phone:formData.phone
      });

      navigate("/suppliers");

    } catch (error) {

      console.error("Update Supplier Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to update supplier");
      }

    } finally {

      setSaving(false);

    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading Supplier...
        </p>
      </div>
    );
  }

return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Supplier</h1>
              <p className="text-gray-500 mt-1">Update Supplier</p>
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
              Company
            </label>
       <input
  type="text"
  name="company"
  value={formData.company}
  onChange={handleChange}
  placeholder="Enter supplier company"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
       <input
  type="text"
  name="contact"
  value={formData.contact}
  onChange={handleChange}
  placeholder="Enter supplier contact"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
       <input
  type="text"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter supplier email"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
       <input
  type="text"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter supplier phone"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>
    </div>
    <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={() => navigate("/suppliers")}
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
export default Editsupplier;
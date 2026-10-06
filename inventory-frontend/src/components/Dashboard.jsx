import React,{useState,useEffect} from 'react'
import {getdashboardSummary} from '../services/dashboardService.js'
const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getdashboardSummary();

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard Error:", error);

        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return <p>No dashboard data available</p>;
  }

  return (
    <div>

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Inventory Management
        </p>
      </div>


      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Total Products */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {dashboard.total_products}
          </h2>
        </div>


        {/* Total Suppliers */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Total Suppliers
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            {dashboard.total_suppliers}
          </h2>
        </div>


        {/* Total Purchase Orders */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Total Purchase Orders
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {dashboard.total_purchase_orders}
          </h2>
        </div>

      </div>


      {/* Status Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

        {/* Total Sales Orders */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-500 text-sm">
            Total Sales Orders
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            {dashboard.total_sales_orders}
          </h2>
        </div>


        {/* Total */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-500 text-sm">
            Total
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {dashboard.total}
          </h2>
        </div>

      </div>

    </div>
  );
}

export default Dashboard

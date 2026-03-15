import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { fetchProducts, fetchSales, fetchPurchases } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    lowStock: 0,
  });
  const [salesChartData, setSalesChartData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, salesRes, purchasesRes] = await Promise.all([
          fetchProducts(),
          fetchSales(),
          fetchPurchases(),
        ]);

        const products = productsRes.data;
        const sales = salesRes.data;
        const purchases = purchasesRes.data;

        const lowStock = products.filter((p) => p.quantity <= 5);
        setLowStockItems(lowStock);

        // Aggregate sales by date for chart
        const salesByDate = {};
        sales.forEach((s) => {
          const day = new Date(s.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          });
          salesByDate[day] = (salesByDate[day] || 0) + s.totalPrice;
        });
        const chartData = Object.entries(salesByDate)
          .map(([date, amount]) => ({ date, amount }))
          .slice(-7);
        setSalesChartData(chartData);

        setStats({
          products: products.length,
          totalRevenue: sales.reduce((sum, s) => sum + s.totalPrice, 0),
          totalPurchases: purchases.length,
          lowStock: lowStock.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: '📦', color: '#0057B8' },
    {
      label: 'Total Sales Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: '#22c55e',
    },
    { label: 'Purchase Records', value: stats.totalPurchases, icon: '🛒', color: '#8b5cf6' },
    { label: 'Low Stock Alerts', value: stats.lowStock, icon: '⚠️', color: '#ef4444' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#0057B8' }}>
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: '#0057B8' }}
          />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: card.color }}>
                    {card.value}
                  </p>
                </div>
                <span className="text-4xl">{card.icon}</span>
              </div>
            ))}
          </div>

          {/* Sales Chart */}
          {salesChartData.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#0057B8' }}>
                Sales Revenue (Recent)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salesChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(val) => [`৳${val.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#0057B8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Low Stock Alert</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left py-2 font-semibold">Product</th>
                      <th className="text-left py-2 font-semibold">Category</th>
                      <th className="text-left py-2 font-semibold">Stock Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((p) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{p.name}</td>
                        <td className="py-2 text-gray-500">{p.category}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              p.quantity === 0
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}
                          >
                            {p.quantity === 0 ? 'Out of stock' : `${p.quantity} left`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {lowStockItems.length === 0 && salesChartData.length === 0 && stats.products === 0 && (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">🚀</p>
              <p className="text-xl font-semibold">Welcome to your dashboard!</p>
              <p className="mt-2">Start by adding products to your inventory.</p>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;

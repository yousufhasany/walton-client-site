import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { fetchSales, addSale, fetchProducts } from '../services/api';

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ productId: '', quantitySold: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesRes, prodRes] = await Promise.all([fetchSales(), fetchProducts()]);
      setSales(salesRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSale = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await addSale({ productId: form.productId, quantitySold: Number(form.quantitySold) });
      setSuccess('Sale recorded successfully! Inventory updated.');
      setForm({ productId: '', quantitySold: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record sale');
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalUnitsSold = sales.reduce((sum, s) => sum + s.quantitySold, 0);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#0057B8' }}>
        Sales Management
      </h1>

      {/* Record Sale Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Record a Sale</h2>
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg mb-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-600 px-4 py-2 rounded-lg mb-3 text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleSale} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              required
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select product</option>
              {products
                .filter((p) => p.quantity > 0)
                .map((p) => (
                  <option key={p._id} value={p.productId}>
                    {p.name} — Stock: {p.quantity}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              required
              min="1"
              value={form.quantitySold}
              onChange={(e) => setForm({ ...form, quantitySold: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Qty"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FF7A00' }}
          >
            {submitting ? 'Recording...' : 'Record Sale'}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Transactions</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#0057B8' }}>
            {sales.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Units Sold</p>
          <p className="text-3xl font-bold mt-1 text-purple-600">{totalUnitsSold}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold mt-1 text-green-600">
            ৳{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: '#0057B8' }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#0057B8' }} className="text-white">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Product ID</th>
                  <th className="text-left px-4 py-3">Qty Sold</th>
                  <th className="text-left px-4 py-3">Total Price</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-2">📈</p>
                      No sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => (
                    <tr key={s._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{s.productName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.productId}</td>
                      <td className="px-4 py-3">{s.quantitySold}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">
                        ৳{s.totalPrice?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(s.date).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSales;

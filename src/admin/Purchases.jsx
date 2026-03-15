import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { fetchPurchases, addPurchase, fetchProducts } from '../services/api';

const AdminPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ productId: '', quantityBought: '', supplier: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [purchRes, prodRes] = await Promise.all([fetchPurchases(), fetchProducts()]);
      setPurchases(purchRes.data);
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

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await addPurchase({
        productId: form.productId,
        quantityBought: Number(form.quantityBought),
        supplier: form.supplier,
      });
      setSuccess('Purchase recorded! Inventory stock updated automatically.');
      setForm({ productId: '', quantityBought: '', supplier: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const totalUnitsBought = purchases.reduce((sum, p) => sum + p.quantityBought, 0);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#0057B8' }}>
        Purchase Management
      </h1>

      {/* Record Purchase Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Record a Purchase</h2>
        <p className="text-sm text-gray-500 mb-4">
          Recording a purchase automatically increases the product's stock quantity.
        </p>
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
        <form onSubmit={handlePurchase} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              required
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p._id} value={p.productId}>
                  {p.name} — Current Stock: {p.quantity}
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
              value={form.quantityBought}
              onChange={(e) => setForm({ ...form, quantityBought: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Qty"
            />
          </div>
          <div className="flex-1 min-w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier (optional)
            </label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Supplier name"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FF7A00' }}
          >
            {submitting ? 'Recording...' : 'Record Purchase'}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Purchase Records</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#0057B8' }}>
            {purchases.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Units Purchased</p>
          <p className="text-3xl font-bold mt-1 text-purple-600">{totalUnitsBought}</p>
        </div>
      </div>

      {/* Purchase History Table */}
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
                  <th className="text-left px-4 py-3">Qty Bought</th>
                  <th className="text-left px-4 py-3">Supplier</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-2">🛒</p>
                      No purchase records yet.
                    </td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.productName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.productId}</td>
                      <td className="px-4 py-3 font-semibold text-purple-600">
                        {p.quantityBought}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.supplier || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(p.date).toLocaleDateString('en-GB')}
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

export default AdminPurchases;

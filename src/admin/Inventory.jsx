import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { fetchProducts, deleteProduct } from '../services/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const loadProducts = (searchTerm = '') => {
    setLoading(true);
    fetchProducts(searchTerm ? { search: searchTerm } : {})
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#0057B8' }}>
          Inventory
        </h1>
        <Link
          to="/admin/inventory/add"
          className="px-5 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#FF7A00' }}
        >
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg text-white font-semibold"
          style={{ backgroundColor: '#0057B8' }}
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              loadProducts('');
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: '#0057B8' }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-3 border-b bg-gray-50 text-sm text-gray-500">
            {products.length} product(s) total
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#0057B8' }} className="text-white">
                <tr>
                  <th className="text-left px-4 py-3">Product ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-2">📦</p>
                      No products found. Add your first product!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.productId}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500">{p.category}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#FF7A00' }}>
                        ৳{p.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            p.quantity > 10
                              ? 'bg-green-100 text-green-700'
                              : p.quantity > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/inventory/edit/${p._id}`}
                            className="px-3 py-1 rounded text-white text-xs font-semibold hover:opacity-80"
                            style={{ backgroundColor: '#0057B8' }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            disabled={deleting === p._id}
                            className="px-3 py-1 rounded text-white text-xs font-semibold bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
                          >
                            {deleting === p._id ? '...' : 'Delete'}
                          </button>
                        </div>
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

export default Inventory;
